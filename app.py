#!/usr/bin/env python3
"""
Aplicação Flask para coleta de informações do cliente (visitante)
"""

from flask import Flask, render_template, jsonify, request
import json
import uuid
from datetime import datetime
import os

app = Flask(__name__)

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
        client_data = request.get_json()
        
        # Adiciona informações do servidor sobre o cliente
        server_info = {
            "timestamp": datetime.now().isoformat(),
            "server_ip": request.remote_addr,
            "user_agent": request.headers.get('User-Agent', ''),
            "accept_language": request.headers.get('Accept-Language', ''),
            "referer": request.headers.get('Referer', ''),
            "host": request.headers.get('Host', ''),
            "forwarded_for": request.headers.get('X-Forwarded-For', ''),
            "real_ip": request.headers.get('X-Real-IP', ''),
            "connection": request.headers.get('Connection', ''),
            "accept_encoding": request.headers.get('Accept-Encoding', ''),
            "x_forwarded_proto": request.headers.get('X-Forwarded-Proto', ''),
            "x_forwarded_host": request.headers.get('X-Forwarded-Host', ''),
            "x_forwarded_port": request.headers.get('X-Forwarded-Port', '')
        }
        
        # Combina dados do cliente com informações do servidor
        combined_info = {
            "client_data": client_data,
            "server_info": server_info,
            "session_id": str(uuid.uuid4())
        }
        
        return jsonify({
            "success": True,
            "data": combined_info
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/export-report', methods=['POST'])
def export_report():
    """Endpoint para exportar relatório do cliente"""
    try:
        client_data = request.get_json()
        
        # Adiciona informações do servidor
        server_info = {
            "timestamp": datetime.now().isoformat(),
            "server_ip": request.remote_addr,
            "user_agent": request.headers.get('User-Agent', ''),
            "accept_language": request.headers.get('Accept-Language', ''),
            "referer": request.headers.get('Referer', ''),
            "host": request.headers.get('Host', ''),
            "forwarded_for": request.headers.get('X-Forwarded-For', ''),
            "real_ip": request.headers.get('X-Real-IP', ''),
            "connection": request.headers.get('Connection', ''),
            "accept_encoding": request.headers.get('Accept-Encoding', '')
        }
        
        # Combina dados do cliente com informações do servidor
        combined_info = {
            "client_data": client_data,
            "server_info": server_info,
            "session_id": str(uuid.uuid4()),
            "export_timestamp": datetime.now().isoformat(),
            "export_format": "json"
        }
        
        return jsonify({
            "success": True,
            "data": combined_info
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)