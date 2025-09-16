# DeviceConnectivity (Coletor de Informações do Cliente)

Aplicação web Flask para coleta e análise de informações detalhadas do navegador, dispositivo e conexão do visitante.

## 🚀 Funcionalidades

### Coleta de Informações do Cliente
- **Navegador**: User Agent, idiomas, plugins, MIME types, WebGL
- **Hardware**: CPU, memória, GPU, sensores, tipos de entrada
- **Tela**: Resolução, orientação, profundidade de cor
- **Rede**: Status de conexão, WebRTC, informações de rede
- **Sistema**: Timezone, localização, performance
- **Segurança**: Permissões, CSP, certificados

### Interface Web
- Interface moderna e responsiva
- Coleta em tempo real
- Exportação de relatórios em JSON
- Visualização organizada por categorias

## 📁 Estrutura do Projeto

```
DeviceConnectivit/
├── app.py                    # Aplicação Flask principal
├── requirements.txt          # Dependências Python
├── README.md                # Este arquivo
├── templates/
│   └── index.html           # Interface web
├── static/
│   ├── css/
│   │   └── style.css        # Estilos CSS
│   └── js/
│       └── app.js           # JavaScript da aplicação
├── scripts/
│   └── device_detector.py   # Script standalone
├── tests/
│   └── network_connectivity_test.py # Testes de rede
└── results/                 # Resultados salvos
```

## 🛠️ Instalação e Uso

### 1. Instalar Dependências
```bash
pip install -r requirements.txt
```

### 2. Executar a Aplicação
```bash
python app.py
```

### 3. Acessar Interface Web
Abra seu navegador e acesse o link: **http://localhost:5000**

### 4. Versão Online (GitHub Pages)
Abra seu navegador e acesse o link: **https://m4r4g0n.github.io/DeviceConnectivit/**

### 5. Usar Funcionalidades
- **Coletar Informações**: Clique no botão para coletar dados do cliente
- **Exportar Relatório**: Baixe um relatório JSON completo

## 🔧 Scripts Adicionais

### Device Detector (Standalone)
```bash
python scripts/device_detector.py
```

### Testes de Conectividade
```bash
python tests/network_connectivity_test.py
```

## 📊 Informações Coletadas

### Navegador
- User Agent completo
- Idiomas suportados
- Plugins instalados
- MIME types suportados
- Informações de segurança

### Hardware
- Núcleos de CPU
- Memória do dispositivo
- Informações da GPU (WebGL)
- Sensores disponíveis
- Tipos de entrada (touch, mouse, teclado)

### Rede
- Status online/offline
- Informações WebRTC
- Detecção de tipo de dispositivo
- Modo de economia de dados

### Sistema
- Informações de timezone
- Performance do navegador
- Timing de carregamento
- Uso de memória

## 🔒 Privacidade e Segurança

- Aplicação roda apenas em localhost
- Não armazena dados permanentemente
- Coleta apenas informações públicas do navegador
- Não acessa dados pessoais ou sensíveis

## 📋 Requisitos

- Python 3.7+
- Navegador moderno com suporte a JavaScript
- Conexão com internet (para algumas funcionalidades)

## 🐛 Solução de Problemas

### Erro de WebGL
- Atualize drivers da GPU
- O warning de software fallback é normal em VMs

### Informações de Rede N/A
- Normal em navegadores modernos (API depreciada)
- Aplicação usa métodos alternativos

## 📄 Licença

MIT License


