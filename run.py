#!/usr/bin/env python3
"""
Script de inicialização da aplicação.

Mantém as mensagens de inicialização alinhadas ao app principal e
remove imports não utilizados.
"""

def main():
    """Inicia a aplicação Flask"""
    print("=== Coletor de Informações do Cliente ===")
    print("Iniciando aplicação Flask...")
    print("Acesse: http://localhost:5000")
    print("Pressione Ctrl+C para parar")
    print("")
    
    # Importa e executa a aplicação
    from app import app
    app.run(debug=True, host='127.0.0.1', port=5000)

if __name__ == '__main__':
    main()





