#!/usr/bin/env python3
"""
Teste de Conectividade de Rede
Testa conectividade básica, ping, portas e largura de banda
"""

import json
import time
import socket
import subprocess
import threading
from datetime import datetime
from typing import Dict, List, Tuple
import ping3
import psutil
import netifaces
from netaddr import IPNetwork


class NetworkConnectivityTest:
    def __init__(self, config_file: str = "config/test_config.json"):
        """Inicializa o teste de conectividade"""
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "tests": {}
        }
    
    def get_local_network(self) -> str:
        """Obtém a rede local atual"""
        try:
            # Obtém o gateway padrão
            gateways = netifaces.gateways()
            default_gateway = gateways['default'][netifaces.AF_INET][0]
            
            # Obtém a interface ativa
            interfaces = netifaces.interfaces()
            for interface in interfaces:
                addrs = netifaces.ifaddresses(interface)
                if netifaces.AF_INET in addrs:
                    for addr in addrs[netifaces.AF_INET]:
                        if addr['addr'] != '127.0.0.1':
                            ip = addr['addr']
                            netmask = addr['netmask']
                            network = IPNetwork(f"{ip}/{netmask}")
                            return str(network.network) + "/" + str(network.prefixlen)
        except Exception as e:
            print(f"Erro ao obter rede local: {e}")
        
        return self.config["network"]["default_subnet"]
    
    def ping_test(self, target: str) -> Dict:
        """Testa conectividade via ping"""
        print(f"Testando ping para {target}...")
        
        results = {
            "target": target,
            "success": False,
            "packets_sent": 0,
            "packets_received": 0,
            "packet_loss": 100.0,
            "avg_response_time": 0.0,
            "min_response_time": 0.0,
            "max_response_time": 0.0
        }
        
        try:
            response_times = []
            packets_sent = self.config["connectivity_tests"]["ping_count"]
            
            for i in range(packets_sent):
                start_time = time.time()
                response = ping3.ping(target, timeout=self.config["network"]["ping_timeout"])
                end_time = time.time()
                
                if response is not None:
                    response_time = (end_time - start_time) * 1000  # ms
                    response_times.append(response_time)
                    results["packets_received"] += 1
                
                results["packets_sent"] += 1
                time.sleep(0.5)  # Intervalo entre pings
            
            if response_times:
                results["success"] = True
                results["packet_loss"] = ((packets_sent - len(response_times)) / packets_sent) * 100
                results["avg_response_time"] = sum(response_times) / len(response_times)
                results["min_response_time"] = min(response_times)
                results["max_response_time"] = max(response_times)
            
        except Exception as e:
            print(f"Erro no teste de ping para {target}: {e}")
        
        return results
    
    def port_scan(self, target: str, ports: List[int]) -> Dict:
        """Testa conectividade em portas específicas"""
        print(f"Testando portas em {target}...")
        
        results = {
            "target": target,
            "open_ports": [],
            "closed_ports": [],
            "filtered_ports": []
        }
        
        def test_port(port: int):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(self.config["network"]["scan_timeout"])
                result = sock.connect_ex((target, port))
                sock.close()
                
                if result == 0:
                    results["open_ports"].append(port)
                else:
                    results["closed_ports"].append(port)
            except Exception:
                results["filtered_ports"].append(port)
        
        # Testa portas em paralelo
        threads = []
        for port in ports:
            thread = threading.Thread(target=test_port, args=(port,))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join()
        
        return results
    
    def bandwidth_test(self, target: str) -> Dict:
        """Testa largura de banda (simulado)"""
        print(f"Testando largura de banda para {target}...")
        
        results = {
            "target": target,
            "download_speed": 0.0,
            "upload_speed": 0.0,
            "latency": 0.0,
            "jitter": 0.0
        }
        
        try:
            # Simula teste de largura de banda
            # Em um cenário real, você usaria ferramentas como iperf3
            start_time = time.time()
            
            # Teste de latência
            response = ping3.ping(target, timeout=5)
            if response is not None:
                results["latency"] = response * 1000  # ms
            
            # Simula medições de velocidade
            results["download_speed"] = 50.0  # Mbps (simulado)
            results["upload_speed"] = 25.0    # Mbps (simulado)
            results["jitter"] = 2.5           # ms (simulado)
            
        except Exception as e:
            print(f"Erro no teste de largura de banda: {e}")
        
        return results
    
    def run_comprehensive_test(self) -> Dict:
        """Executa todos os testes de conectividade"""
        print("Iniciando testes de conectividade...")
        
        # Obtém a rede local
        network = self.get_local_network()
        print(f"Rede detectada: {network}")
        
        # Testa gateway
        gateways = netifaces.gateways()
        gateway_ip = gateways['default'][netifaces.AF_INET][0]
        
        # Testa conectividade com gateway
        gateway_ping = self.ping_test(gateway_ip)
        self.results["tests"]["gateway_ping"] = gateway_ping
        
        # Testa conectividade com DNS público
        dns_ping = self.ping_test("8.8.8.8")
        self.results["tests"]["dns_ping"] = dns_ping
        
        # Testa portas no gateway
        gateway_ports = self.port_scan(gateway_ip, self.config["network"]["common_ports"])
        self.results["tests"]["gateway_ports"] = gateway_ports
        
        # Teste de largura de banda
        if self.config["connectivity_tests"]["bandwidth_test"]["enabled"]:
            bandwidth = self.bandwidth_test(gateway_ip)
            self.results["tests"]["bandwidth"] = bandwidth
        
        # Informações do sistema
        self.results["system_info"] = {
            "hostname": socket.gethostname(),
            "interfaces": list(netifaces.interfaces()),
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent
        }
        
        return self.results
    
    def save_results(self, filename: str = None):
        """Salva os resultados em arquivo"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"results/connectivity_test_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"Resultados salvos em: {filename}")


def main():
    """Função principal"""
    print("=== Teste de Conectividade de Rede ===")
    
    tester = NetworkConnectivityTest()
    results = tester.run_comprehensive_test()
    
    # Exibe resumo dos resultados
    print("\n=== Resumo dos Resultados ===")
    
    if "gateway_ping" in results["tests"]:
        gateway = results["tests"]["gateway_ping"]
        print(f"Gateway ({gateway['target']}): {'✓' if gateway['success'] else '✗'}")
        if gateway['success']:
            print(f"  - Latência média: {gateway['avg_response_time']:.2f}ms")
            print(f"  - Perda de pacotes: {gateway['packet_loss']:.1f}%")
    
    if "dns_ping" in results["tests"]:
        dns = results["tests"]["dns_ping"]
        print(f"DNS Público ({dns['target']}): {'✓' if dns['success'] else '✗'}")
        if dns['success']:
            print(f"  - Latência média: {dns['avg_response_time']:.2f}ms")
    
    if "gateway_ports" in results["tests"]:
        ports = results["tests"]["gateway_ports"]
        print(f"Portas abertas no gateway: {len(ports['open_ports'])}")
        if ports['open_ports']:
            print(f"  - Portas: {', '.join(map(str, ports['open_ports']))}")
    
    # Salva resultados
    tester.save_results()


if __name__ == "__main__":
    main()


