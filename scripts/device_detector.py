#!/usr/bin/env python3
"""
Script para detecção e coleta de informações de dispositivos
Pode ser executado independentemente da aplicação web
"""

import json
import platform
import socket
import psutil
import netifaces
import uuid
import subprocess
import os
from datetime import datetime
from typing import Dict, List, Optional
import argparse


class DeviceDetector:
    """Detector de dispositivos e coletor de informações"""
    
    def __init__(self):
        self.device_id = self._generate_device_id()
        self.timestamp = datetime.now().isoformat()
    
    def _generate_device_id(self) -> str:
        """Gera um ID único para o dispositivo"""
        try:
            # Tenta usar MAC address
            mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) 
                           for ele in range(0,8*6,8)][::-1])
            return f"device_{mac.replace(':', '')}"
        except:
            # Fallback para hostname
            return f"device_{socket.gethostname()}"
    
    def get_system_info(self) -> Dict:
        """Coleta informações do sistema operacional"""
        return {
            "hostname": socket.gethostname(),
            "platform": platform.platform(),
            "system": platform.system(),
            "release": platform.release(),
            "version": platform.version(),
            "machine": platform.machine(),
            "processor": platform.processor(),
            "architecture": platform.architecture(),
            "python_version": platform.python_version(),
            "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
            "uptime": self._get_uptime()
        }
    
    def _get_uptime(self) -> str:
        """Calcula o tempo de atividade do sistema"""
        try:
            boot_time = psutil.boot_time()
            uptime_seconds = datetime.now().timestamp() - boot_time
            days = int(uptime_seconds // 86400)
            hours = int((uptime_seconds % 86400) // 3600)
            minutes = int((uptime_seconds % 3600) // 60)
            return f"{days}d {hours}h {minutes}m"
        except:
            return "N/A"
    
    def get_network_info(self) -> Dict:
        """Coleta informações de rede"""
        network_info = {
            "interfaces": [],
            "gateways": {},
            "hostname": socket.gethostname(),
            "fqdn": socket.getfqdn(),
            "local_ip": self._get_local_ip()
        }
        
        try:
            # Interfaces de rede
            for interface in netifaces.interfaces():
                addrs = netifaces.ifaddresses(interface)
                interface_info = {
                    "name": interface,
                    "addresses": [],
                    "is_up": self._is_interface_up(interface)
                }
                
                if netifaces.AF_INET in addrs:
                    for addr in addrs[netifaces.AF_INET]:
                        interface_info["addresses"].append({
                            "family": "IPv4",
                            "address": addr.get('addr'),
                            "netmask": addr.get('netmask'),
                            "broadcast": addr.get('broadcast')
                        })
                
                if netifaces.AF_INET6 in addrs:
                    for addr in addrs[netifaces.AF_INET6]:
                        interface_info["addresses"].append({
                            "family": "IPv6",
                            "address": addr.get('addr'),
                            "netmask": addr.get('netmask')
                        })
                
                network_info["interfaces"].append(interface_info)
            
            # Gateways
            gateways = netifaces.gateways()
            network_info["gateways"] = gateways
            
        except Exception as e:
            network_info["error"] = str(e)
        
        return network_info
    
    def _get_local_ip(self) -> str:
        """Obtém o IP local principal"""
        try:
            # Conecta a um endereço externo para determinar o IP local
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except:
            return "127.0.0.1"
    
    def _is_interface_up(self, interface: str) -> bool:
        """Verifica se uma interface está ativa"""
        try:
            # Verifica se a interface tem endereços IP
            addrs = netifaces.ifaddresses(interface)
            return netifaces.AF_INET in addrs and len(addrs[netifaces.AF_INET]) > 0
        except:
            return False
    
    def get_hardware_info(self) -> Dict:
        """Coleta informações de hardware"""
        try:
            # CPU
            cpu_info = {
                "physical_cores": psutil.cpu_count(logical=False),
                "total_cores": psutil.cpu_count(logical=True),
                "max_frequency": psutil.cpu_freq().max if psutil.cpu_freq() else None,
                "current_frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None,
                "cpu_percent": psutil.cpu_percent(interval=1),
                "cpu_per_core": psutil.cpu_percent(interval=1, percpu=True)
            }
            
            # Memória
            memory = psutil.virtual_memory()
            memory_info = {
                "total": memory.total,
                "available": memory.available,
                "used": memory.used,
                "free": memory.free,
                "percent": memory.percent,
                "cached": getattr(memory, 'cached', 0),
                "buffers": getattr(memory, 'buffers', 0)
            }
            
            # Disco
            disk_info = []
            for partition in psutil.disk_partitions():
                try:
                    partition_usage = psutil.disk_usage(partition.mountpoint)
                    disk_info.append({
                        "device": partition.device,
                        "mountpoint": partition.mountpoint,
                        "fstype": partition.fstype,
                        "total": partition_usage.total,
                        "used": partition_usage.used,
                        "free": partition_usage.free,
                        "percent": (partition_usage.used / partition_usage.total) * 100
                    })
                except PermissionError:
                    pass
            
            # Informações adicionais do sistema
            system_info = {
                "load_average": os.getloadavg() if hasattr(os, 'getloadavg') else None,
                "processes": len(psutil.pids()),
                "users": len(psutil.users())
            }
            
            return {
                "cpu": cpu_info,
                "memory": memory_info,
                "disk": disk_info,
                "system": system_info
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_installed_software(self) -> List[Dict]:
        """Lista software instalado (limitado)"""
        software = []
        
        try:
            # Python packages
            result = subprocess.run(['pip', 'list', '--format=json'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                packages = json.loads(result.stdout)
                software.extend([{
                    "name": pkg["name"],
                    "version": pkg["version"],
                    "type": "python_package"
                } for pkg in packages[:20]])  # Limita a 20 pacotes
        except:
            pass
        
        return software
    
    def get_environment_info(self) -> Dict:
        """Coleta informações do ambiente"""
        return {
            "user": os.getenv('USER', 'unknown'),
            "home": os.getenv('HOME', 'unknown'),
            "shell": os.getenv('SHELL', 'unknown'),
            "path": os.getenv('PATH', 'unknown'),
            "python_path": os.sys.executable,
            "working_directory": os.getcwd(),
            "environment_variables": dict(os.environ)
        }
    
    def discover_network_devices(self, subnet: str = None) -> List[Dict]:
        """Descobre dispositivos na rede local"""
        devices = []
        
        try:
            if not subnet:
                # Obtém a rede local automaticamente
                gateways = netifaces.gateways()
                gateway_ip = gateways['default'][netifaces.AF_INET][0]
                subnet = f"{gateway_ip.rsplit('.', 1)[0]}.0/24"
            
            print(f"Escaneando rede: {subnet}")
            
            # Adiciona o próprio dispositivo
            devices.append({
                "ip": self._get_local_ip(),
                "hostname": socket.gethostname(),
                "mac": self._get_mac_address(),
                "status": "online",
                "type": "current_device",
                "discovered_at": datetime.now().isoformat()
            })
            
            # Adiciona gateway
            gateways = netifaces.gateways()
            gateway_ip = gateways['default'][netifaces.AF_INET][0]
            devices.append({
                "ip": gateway_ip,
                "hostname": "gateway",
                "mac": "unknown",
                "status": "online",
                "type": "gateway",
                "discovered_at": datetime.now().isoformat()
            })
            
            # Em um cenário real, você usaria nmap ou similar para escanear a rede
            # Aqui simulamos alguns dispositivos comuns
            common_ips = [
                f"{gateway_ip.rsplit('.', 1)[0]}.1",  # Gateway
                f"{gateway_ip.rsplit('.', 1)[0]}.100", # Dispositivo comum
                f"{gateway_ip.rsplit('.', 1)[0]}.200", # Dispositivo comum
            ]
            
            for ip in common_ips:
                if ip not in [d["ip"] for d in devices]:
                    devices.append({
                        "ip": ip,
                        "hostname": f"device-{ip.split('.')[-1]}",
                        "mac": "unknown",
                        "status": "unknown",
                        "type": "unknown",
                        "discovered_at": datetime.now().isoformat()
                    })
            
        except Exception as e:
            print(f"Erro ao descobrir dispositivos: {e}")
        
        return devices
    
    def _get_mac_address(self) -> str:
        """Obtém o endereço MAC da interface principal"""
        try:
            mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) 
                           for ele in range(0,8*6,8)][::-1])
            return mac
        except:
            return "unknown"
    
    def collect_all_info(self) -> Dict:
        """Coleta todas as informações disponíveis"""
        print("Coletando informações do dispositivo...")
        
        info = {
            "device_id": self.device_id,
            "timestamp": self.timestamp,
            "system": self.get_system_info(),
            "network": self.get_network_info(),
            "hardware": self.get_hardware_info(),
            "software": self.get_installed_software(),
            "environment": self.get_environment_info(),
            "network_devices": self.discover_network_devices()
        }
        
        print("Informações coletadas com sucesso!")
        return info
    
    def save_to_file(self, filename: str = None) -> str:
        """Salva as informações em arquivo JSON"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"results/device_info_{timestamp}.json"
        
        # Cria o diretório se não existir
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        info = self.collect_all_info()
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(info, f, indent=2, ensure_ascii=False)
        
        print(f"Informações salvas em: {filename}")
        return filename
    
    def print_summary(self):
        """Imprime um resumo das informações"""
        info = self.collect_all_info()
        
        print("\n" + "="*60)
        print("RESUMO DAS INFORMAÇÕES DO DISPOSITIVO")
        print("="*60)
        
        # Sistema
        system = info["system"]
        print(f"\nSistema:")
        print(f"  Hostname: {system['hostname']}")
        print(f"  Sistema: {system['system']} {system['release']}")
        print(f"  Arquitetura: {system['architecture'][0]}")
        print(f"  Uptime: {system['uptime']}")
        
        # Hardware
        hardware = info["hardware"]
        if "error" not in hardware:
            cpu = hardware["cpu"]
            memory = hardware["memory"]
            print(f"\nHardware:")
            print(f"  CPU: {cpu['physical_cores']} cores físicos, {cpu['total_cores']} cores totais")
            print(f"  Uso CPU: {cpu['cpu_percent']:.1f}%")
            print(f"  Memória: {self._format_bytes(memory['used'])} / {self._format_bytes(memory['total'])} ({memory['percent']:.1f}%)")
        
        # Rede
        network = info["network"]
        print(f"\nRede:")
        print(f"  IP Local: {network['local_ip']}")
        print(f"  Interfaces ativas: {len([i for i in network['interfaces'] if i['is_up']])}")
        
        # Dispositivos na rede
        devices = info["network_devices"]
        print(f"\nDispositivos na rede: {len(devices)}")
        for device in devices:
            print(f"  {device['ip']} - {device['hostname']} ({device['type']})")
        
        print("\n" + "="*60)
    
    def _format_bytes(self, bytes_value: int) -> str:
        """Formata bytes em unidades legíveis"""
        if bytes_value == 0:
            return "0 B"
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        while bytes_value >= 1024 and i < len(size_names) - 1:
            bytes_value /= 1024.0
            i += 1
        return f"{bytes_value:.1f} {size_names[i]}"


def main():
    """Função principal"""
    parser = argparse.ArgumentParser(description="Detector de dispositivos e coletor de informações")
    parser.add_argument("--output", "-o", help="Arquivo de saída (JSON)")
    parser.add_argument("--summary", "-s", action="store_true", help="Mostra apenas resumo")
    parser.add_argument("--network-scan", "-n", action="store_true", help="Inclui escaneamento de rede")
    
    args = parser.parse_args()
    
    detector = DeviceDetector()
    
    if args.summary:
        detector.print_summary()
    else:
        if args.output:
            detector.save_to_file(args.output)
        else:
            # Salva com timestamp automático
            detector.save_to_file()
        
        # Mostra resumo também
        detector.print_summary()


if __name__ == "__main__":
    main()


