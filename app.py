#!/usr/bin/env python3
"""
Aplicação Flask para coleta de informações do cliente (visitante).

Melhorias de legibilidade:
- Helpers para montar informações do servidor e respostas JSON
- Remoção de imports não utilizados
- Padronização de host/porta de execução
"""

from flask import Flask, render_template, jsonify, request
import uuid
from datetime import datetime

app = Flask(__name__)


def _build_server_info() -> dict:
    """Monta informações do lado do servidor a partir do request atual."""
    return {
        "timestamp": datetime.now().isoformat(),
        "server_ip": request.remote_addr,
        "user_agent": request.headers.get("User-Agent", ""),
        "accept_language": request.headers.get("Accept-Language", ""),
        "referer": request.headers.get("Referer", ""),
        "host": request.headers.get("Host", ""),
        "forwarded_for": request.headers.get("X-Forwarded-For", ""),
        "real_ip": request.headers.get("X-Real-IP", ""),
        "connection": request.headers.get("Connection", ""),
        "accept_encoding": request.headers.get("Accept-Encoding", ""),
        "x_forwarded_proto": request.headers.get("X-Forwarded-Proto", ""),
        "x_forwarded_host": request.headers.get("X-Forwarded-Host", ""),
        "x_forwarded_port": request.headers.get("X-Forwarded-Port", ""),
    }


def _json_success(data: dict, status_code: int = 200):
    """Retorna resposta JSON de sucesso padronizada."""
    return jsonify({"success": True, "data": data}), status_code


def _json_error(message: str, status_code: int = 500):
    """Retorna resposta JSON de erro padronizada."""
    return jsonify({"success": False, "error": message}), status_code

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/ping', methods=['HEAD', 'GET'])
def ping():
    """Endpoint simples para testar latência de rede"""
    return '', 200

@app.route('/api/client-info', methods=['POST'])
def client_info():
    """Endpoint para receber informações do cliente"""
    try:
        client_data = request.get_json() or {}

        combined_info = {
            "client_data": client_data,
            "server_info": _build_server_info(),
            "session_id": str(uuid.uuid4()),
        }

        return _json_success(combined_info)
    except Exception as e:
        return _json_error(str(e))

@app.route('/api/export-report', methods=['POST'])
def export_report():
    """Endpoint para exportar relatório do cliente"""
    try:
        client_data = request.get_json() or {}

        combined_info = {
            "client_data": client_data,
            "server_info": _build_server_info(),
            "session_id": str(uuid.uuid4()),
            "export_timestamp": datetime.now().isoformat(),
            "export_format": "json",
        }

        return _json_success(combined_info)
    except Exception as e:
        return _json_error(str(e))

if __name__ == '__main__':
    # Padroniza execução local na porta 5000
    app.run(debug=True, host='127.0.0.1', port=5000)