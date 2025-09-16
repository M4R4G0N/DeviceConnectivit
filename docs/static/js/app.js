// Versão estática: desativa chamadas ao backend e usa apenas coleta local

class ClientInfoApp {
    constructor() {
        this.el = (id) => document.getElementById(id);
        this.show = (id) => this.el(id).classList.remove('hidden');
        this.hide = (id) => this.el(id).classList.add('hidden');
        this.setText = (id, text) => this.el(id).textContent = text;
        this.init();
    }

    init() {
        // Gatilhos de UI
        this.el('collectClientInfo').addEventListener('click', () => this.collectClientInfo());
        this.el('exportReport').addEventListener('click', () => this.exportReport());

        // Garantir que o aviso de erro esteja invisível ao carregar
        this.hide('error');
        this.hide('results');
    }

    showLoading() {
        this.show('loading');
        this.hide('results');
        this.hide('error');
    }

    hideLoading() {
        this.hide('loading');
    }

    showError(message) {
        this.setText('errorMessage', message);
        this.show('error');
        this.hide('results');
    }

    showResults() {
        this.show('results');
        this.hide('error');
    }

    collectClientInfo() {
        this.showLoading();
        try {
            const dados = this.coletarDados();
            this.render(dados);
            this.showResults();
        } catch (e) {
            this.showError(`Erro: ${e.message}`);
        } finally {
            this.hideLoading();
        }
    }

    exportReport() {
        try {
            const payload = {
                client_data: this.getClientInfo(),
                server_info: this.getPseudoServerInfo(),
                session_id: this.generateSessionId(),
                export_timestamp: new Date().toISOString(),
                export_format: 'json'
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `client-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            this.showError(`Erro ao exportar: ${error.message}`);
        }
    }

    generateSessionId() { return this._uuid(); }

    getPseudoServerInfo() {
        return {
            timestamp: new Date().toISOString(),
            server_ip: '0.0.0.0',
            user_agent: navigator.userAgent,
            accept_language: navigator.language,
            referer: document.referrer,
            host: location.host,
            forwarded_for: '',
            real_ip: '',
            connection: navigator.onLine ? 'online' : 'offline',
            accept_encoding: '',
            x_forwarded_proto: location.protocol.replace(':',''),
            x_forwarded_host: location.hostname,
            x_forwarded_port: location.port
        };
    }

    // Coleta apenas 5 seções: navegador, tela, janela, rede, servidor
    coletarDados() {
        const navegador = {
            userAgent: navigator.userAgent,
            idioma: navigator.language,
            idiomas: Array.isArray(navigator.languages) ? navigator.languages : [],
            plataforma: navigator.platform,
            cookies: navigator.cookieEnabled ? 'Habilitado' : 'Desabilitado',
            online: navigator.onLine ? 'Sim' : 'Não'
        };

        const tela = {
            resolucao: `${screen.width}x${screen.height}`,
            disponivel: `${screen.availWidth}x${screen.availHeight}`,
            profundidadeDeCor: `${screen.colorDepth} bits`
        };

        const janela = {
            largura: `${window.innerWidth}px`,
            altura: `${window.innerHeight}px`,
            devicePixelRatio: window.devicePixelRatio
        };

        const rede = {
            status: navigator.onLine ? 'Conectado' : 'Desconectado',
            tipoDispositivo: this._tipoDispositivo()
        };

        const servidor = {
            host: location.host,
            protocolo: location.protocol.replace(':',''),
            timestamp: new Date().toISOString(),
            sessionId: this._uuid()
        };

        return { navegador, tela, janela, rede, servidor };
    }

    _tipoDispositivo() {
        const ua = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|tablet/.test(ua)) return 'Mobile/Tablet';
        if (/desktop|laptop|pc|mac|windows/.test(ua)) return 'Desktop';
        return 'Desconhecido';
    }

    render(dados) {
        const container = this.el('clientInfo');
        container.innerHTML = '';

        const sec = (titulo, pares) => {
            const section = document.createElement('div');
            section.className = 'info-section';
            section.innerHTML = `<h4>${titulo}</h4>`;
            pares.forEach(([label, value]) => {
                const div = document.createElement('div');
                div.className = 'info-item';
                div.innerHTML = `<span class="info-label">${label}:</span><span class="info-value">${value}</span>`;
                section.appendChild(div);
            });
            container.appendChild(section);
        };

        sec('Navegador', [
            ['User Agent', dados.navegador.userAgent],
            ['Idioma', dados.navegador.idioma],
            ['Idiomas Suportados', dados.navegador.idiomas.join(', ') || 'N/A'],
            ['Plataforma', dados.navegador.plataforma],
            ['Cookies', dados.navegador.cookies],
            ['Online', dados.navegador.online]
        ]);

        sec('Tela', [
            ['Resolução', dados.tela.resolucao],
            ['Resolução Disponível', dados.tela.disponivel],
            ['Profundidade de Cor', dados.tela.profundidadeDeCor]
        ]);

        sec('Janela', [
            ['Largura Interna', dados.janela.largura],
            ['Altura Interna', dados.janela.altura],
            ['Device Pixel Ratio', dados.janela.devicePixelRatio]
        ]);

        sec('Rede', [
            ['Status', dados.rede.status],
            ['Tipo de Dispositivo', dados.rede.tipoDispositivo]
        ]);

        sec('Informações do Servidor', [
            ['Host', dados.servidor.host],
            ['Protocolo', dados.servidor.protocolo],
            ['Timestamp', new Date(dados.servidor.timestamp).toLocaleString()],
            ['Session ID', dados.servidor.sessionId]
        ]);
    }

    _uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}

document.addEventListener('DOMContentLoaded', () => new ClientInfoApp());


