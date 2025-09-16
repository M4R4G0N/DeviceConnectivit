// Versão estática: desativa chamadas ao backend e usa apenas coleta local

class ClientInfoApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('collectClientInfo').addEventListener('click', () => {
            this.collectClientInfo();
        });

        document.getElementById('exportReport').addEventListener('click', () => {
            this.exportReport();
        });
    }

    el(id) { return document.getElementById(id); }
    show(id) { this.el(id).classList.remove('hidden'); }
    hide(id) { this.el(id).classList.add('hidden'); }
    setText(id, text) { this.el(id).textContent = text; }

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

    async collectClientInfo() {
        this.showLoading();
        try {
            const clientData = this.getClientInfo();
            const serverInfo = this.getPseudoServerInfo();
            const combined = { client_data: clientData, server_info: serverInfo, session_id: this.generateSessionId() };
            this.displayClientInfo(combined);
            this.showResults();
        } catch (error) {
            this.showError(`Erro: ${error.message}`);
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

    generateSessionId() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

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

    // Abaixo, versões reduzidas dos coletores do app principal
    getClientInfo() {
        return {
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages || [],
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                doNotTrack: navigator.doNotTrack,
                vendor: navigator.vendor,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
            },
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: screen.orientation ? screen.orientation.type : 'N/A'
            },
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                devicePixelRatio: window.devicePixelRatio
            },
            timezone: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                offset: new Date().getTimezoneOffset(),
            },
            hardware: {
                cores: navigator.hardwareConcurrency || 'N/A',
                memory: navigator.deviceMemory || 'N/A',
                maxTouchPoints: navigator.maxTouchPoints || 0,
            },
            performance: {
                connection: {
                    online: navigator.onLine,
                    connectionType: this.detectConnectionType(),
                    saveData: this.detectSaveData(),
                    webRTC: { available: !!window.RTCPeerConnection }
                }
            },
            timestamp: new Date().toISOString(),
            localTime: new Date().toLocaleString()
        };
    }

    detectConnectionType() {
        const ua = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad/.test(ua)) return 'Mobile';
        if (/desktop|laptop|pc|mac|windows/.test(ua)) return 'Desktop';
        return 'Unknown';
    }

    detectSaveData() {
        if (navigator.connection && navigator.connection.saveData !== undefined) {
            return navigator.connection.saveData;
        }
        if (navigator.connection && navigator.connection.effectiveType) {
            return navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g';
        }
        return 'N/A';
    }

    displayClientInfo(data) {
        const container = document.getElementById('clientInfo');
        container.innerHTML = '';

        const clientInfo = data.client_data;
        const serverInfo = data.server_info;

        const addSection = (title, items) => {
            const section = document.createElement('div');
            section.className = 'info-section';
            section.innerHTML = `<h4>${title}</h4>`;
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'info-item';
                div.innerHTML = `<span class="info-label">${item.label}:</span><span class="info-value">${item.value}</span>`;
                section.appendChild(div);
            });
            container.appendChild(section);
        };

        addSection('Navegador', [
            { label: 'User Agent', value: clientInfo.browser.userAgent },
            { label: 'Idioma', value: clientInfo.browser.language },
            { label: 'Idiomas Suportados', value: Array.isArray(clientInfo.browser.languages) ? clientInfo.browser.languages.join(', ') : 'N/A' },
            { label: 'Plataforma', value: clientInfo.browser.platform },
        ]);

        addSection('Tela', [
            { label: 'Resolução', value: `${clientInfo.screen.width}x${clientInfo.screen.height}` },
            { label: 'Res. Disponível', value: `${clientInfo.screen.availWidth}x${clientInfo.screen.availHeight}` },
            { label: 'Profundidade de Cor', value: `${clientInfo.screen.colorDepth} bits` },
        ]);

        addSection('Janela', [
            { label: 'Largura Interna', value: `${clientInfo.window.innerWidth}px` },
            { label: 'Altura Interna', value: `${clientInfo.window.innerHeight}px` },
            { label: 'Device Pixel Ratio', value: clientInfo.window.devicePixelRatio },
        ]);

        addSection('Rede', [
            { label: 'Status Online', value: clientInfo.performance.connection.online ? 'Conectado' : 'Desconectado' },
            { label: 'Tipo de Dispositivo', value: clientInfo.performance.connection.connectionType },
            { label: 'Economia de Dados', value: clientInfo.performance.connection.saveData === true ? 'Ativado' : (clientInfo.performance.connection.saveData === false ? 'Desativado' : 'N/A') },
        ]);

        addSection('Informações do "Servidor"', [
            { label: 'Host', value: serverInfo.host },
            { label: 'Protocolo', value: serverInfo.x_forwarded_proto },
            { label: 'Timestamp', value: new Date(serverInfo.timestamp).toLocaleString() },
            { label: 'Session ID', value: data.session_id },
        ]);
    }
}

document.addEventListener('DOMContentLoaded', () => new ClientInfoApp());


