// JavaScript para coleta de informações do cliente

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

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('error').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
    }

    showResults() {
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
    }

    async collectClientInfo() {
        this.showLoading();
        
        try {
            // Coletar informações do cliente (navegador)
            const clientData = this.getClientInfo();
            
            // Enviar para o servidor
            const response = await fetch('/api/client-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayClientInfo(data.data);
                this.showResults();
            } else {
                this.showError(`Erro ao coletar informações do cliente: ${data.error}`);
            }
        } catch (error) {
            this.showError(`Erro de conexão: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    getClientInfo() {
        return {
            // Informações do navegador
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                doNotTrack: navigator.doNotTrack,
                vendor: navigator.vendor,
                vendorSub: navigator.vendorSub,
                productSub: navigator.productSub,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                appCodeName: navigator.appCodeName,
                // Informações adicionais do navegador
                buildID: navigator.buildID || 'N/A',
                oscpu: navigator.oscpu || 'N/A',
                product: navigator.product || 'N/A',
                userAgentData: navigator.userAgentData ? {
                    brands: navigator.userAgentData.brands,
                    mobile: navigator.userAgentData.mobile,
                    platform: navigator.userAgentData.platform
                } : 'N/A',
                // Informações de segurança
                webdriver: navigator.webdriver || false,
                // Informações de plugins
                plugins: Array.from(navigator.plugins).map(plugin => ({
                    name: plugin.name,
                    filename: plugin.filename,
                    description: plugin.description
                })),
                // Informações de MIME types
                mimeTypes: Array.from(navigator.mimeTypes).map(mime => ({
                    type: mime.type,
                    description: mime.description,
                    suffixes: mime.suffixes
                }))
            },
            
            // Informações da tela
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: screen.orientation ? screen.orientation.type : 'N/A',
                // Informações adicionais da tela
                availLeft: screen.availLeft,
                availTop: screen.availTop,
                left: screen.left,
                top: screen.top,
                // Informações de orientação detalhadas
                orientationDetails: screen.orientation ? {
                    angle: screen.orientation.angle,
                    type: screen.orientation.type,
                    onchange: typeof screen.orientation.onchange
                } : 'N/A',
                // Informações de múltiplas telas
                isExtended: screen.isExtended || false,
                // Informações de brilho (se disponível)
                brightness: screen.brightness || 'N/A'
            },
            
            // Informações da janela
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                devicePixelRatio: window.devicePixelRatio,
                screenX: window.screenX,
                screenY: window.screenY,
                // Informações adicionais da janela
                screenLeft: window.screenLeft,
                screenTop: window.screenTop,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                pageXOffset: window.pageXOffset,
                pageYOffset: window.pageYOffset,
                // Informações de viewport
                visualViewport: window.visualViewport ? {
                    width: window.visualViewport.width,
                    height: window.visualViewport.height,
                    offsetLeft: window.visualViewport.offsetLeft,
                    offsetTop: window.visualViewport.offsetTop,
                    scale: window.visualViewport.scale
                } : 'N/A',
                // Informações de foco
                documentHasFocus: document.hasFocus(),
                // Informações de visibilidade
                visibilityState: document.visibilityState,
                hidden: document.hidden
            },
            
            // Informações de localização
            location: {
                href: window.location.href,
                protocol: window.location.protocol,
                host: window.location.host,
                hostname: window.location.hostname,
                port: window.location.port,
                pathname: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash,
                origin: window.location.origin,
                // Informações adicionais de localização
                ancestorOrigins: window.location.ancestorOrigins ? Array.from(window.location.ancestorOrigins) : 'N/A',
                // Informações de referrer
                referrer: document.referrer,
                // Informações de domínio
                domain: document.domain,
                // Informações de URL base
                baseURI: document.baseURI,
                // Informações de título
                title: document.title,
                // Informações de charset
                characterSet: document.characterSet,
                charset: document.charset,
                defaultCharset: document.defaultCharset
            },
            
            // Informações de timezone
            timezone: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                offset: new Date().getTimezoneOffset(),
                locale: Intl.DateTimeFormat().resolvedOptions().locale,
                // Informações adicionais de timezone
                offsetHours: new Date().getTimezoneOffset() / -60,
                offsetString: new Date().toString().split('(')[1]?.split(')')[0] || 'N/A',
                // Informações de data/hora
                currentTime: new Date().toISOString(),
                localTime: new Date().toLocaleString(),
                localDate: new Date().toLocaleDateString(),
                localTimeString: new Date().toLocaleTimeString(),
                // Informações de calendário
                calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
                numberingSystem: Intl.DateTimeFormat().resolvedOptions().numberingSystem,
                // Informações de formato de data
                dateFormat: new Date().toLocaleDateString(),
                timeFormat: new Date().toLocaleTimeString(),
                // Informações de fuso horário
                timezoneOffset: new Date().getTimezoneOffset(),
                timezoneName: Intl.DateTimeFormat('en', {timeZoneName: 'long'}).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || 'N/A'
            },
            
            // Informações de hardware (limitadas pelo navegador)
            hardware: {
                cores: navigator.hardwareConcurrency || 'N/A',
                memory: navigator.deviceMemory || 'N/A',
                maxTouchPoints: navigator.maxTouchPoints || 0,
                // Informações adicionais de hardware
                gpu: {
                    vendor: this.getGPUVendor(),
                    renderer: this.getGPURenderer(),
                    version: this.getGPUVersion(),
                    webglSupport: this.getWebGLSupport(),
                    webglExtensions: this.getWebGLExtensions()
                },
                // Informações de dispositivo
                deviceType: this.getDeviceType(),
                // Informações de entrada
                inputTypes: this.getInputTypes(),
                // Informações de sensores
                sensors: this.getSensorInfo()
            },
            
            // Informações de performance
            performance: {
                connection: this.getNetworkInfo(),
                timing: performance.timing ? {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    // Informações detalhadas de timing
                    navigationStart: performance.timing.navigationStart,
                    unloadEventStart: performance.timing.unloadEventStart,
                    unloadEventEnd: performance.timing.unloadEventEnd,
                    redirectStart: performance.timing.redirectStart,
                    redirectEnd: performance.timing.redirectEnd,
                    fetchStart: performance.timing.fetchStart,
                    domainLookupStart: performance.timing.domainLookupStart,
                    domainLookupEnd: performance.timing.domainLookupEnd,
                    connectStart: performance.timing.connectStart,
                    connectEnd: performance.timing.connectEnd,
                    secureConnectionStart: performance.timing.secureConnectionStart,
                    requestStart: performance.timing.requestStart,
                    responseStart: performance.timing.responseStart,
                    responseEnd: performance.timing.responseEnd,
                    domLoading: performance.timing.domLoading,
                    domInteractive: performance.timing.domInteractive,
                    domContentLoadedEventStart: performance.timing.domContentLoadedEventStart,
                    domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
                    domComplete: performance.timing.domComplete,
                    loadEventStart: performance.timing.loadEventStart,
                    loadEventEnd: performance.timing.loadEventEnd
                } : 'N/A',
                // Informações de performance adicionais
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                } : 'N/A',
                // Informações de navegação
                navigation: performance.navigation ? {
                    type: performance.navigation.type,
                    redirectCount: performance.navigation.redirectCount
                } : 'N/A',
                // Informações de recursos
                resources: performance.getEntriesByType('resource').length,
                // Informações de paint
                paint: performance.getEntriesByType('paint').map(entry => ({
                    name: entry.name,
                    startTime: entry.startTime,
                    duration: entry.duration
                }))
            },
            
            // Informações de geolocalização (se disponível)
            geolocation: {
                available: 'geolocation' in navigator
            },
            
            // Informações de mídia
            media: {
                mediaDevices: navigator.mediaDevices ? 'Disponível' : 'Não disponível',
                webRTC: window.RTCPeerConnection ? 'Disponível' : 'Não disponível'
            },
            
            // Timestamp
            timestamp: new Date().toISOString(),
            localTime: new Date().toLocaleString(),
            
            // Informações adicionais expandidas
            additional: {
                // Informações de cookies
                cookies: document.cookie,
                cookieCount: document.cookie.split(';').filter(c => c.trim()).length,
                
                // Informações de storage
                localStorage: {
                    available: typeof Storage !== 'undefined',
                    items: localStorage.length,
                    keys: Object.keys(localStorage)
                },
                sessionStorage: {
                    available: typeof Storage !== 'undefined',
                    items: sessionStorage.length,
                    keys: Object.keys(sessionStorage)
                },
                
                // Informações de WebRTC
                webRTC: {
                    available: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection),
                    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
                },
                
                // Informações de WebGL
                webGL: {
                    available: !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')),
                    version: this.getWebGLVersion()
                },
                
                // Informações de WebAssembly
                webAssembly: {
                    available: typeof WebAssembly !== 'undefined'
                },
                
                // Informações de Service Workers
                serviceWorker: {
                    available: 'serviceWorker' in navigator
                },
                
                // Informações de Push Notifications
                pushNotifications: {
                    available: 'PushManager' in window
                },
                
                // Informações de Notifications
                notifications: {
                    available: 'Notification' in window,
                    permission: 'Notification' in window ? Notification.permission : 'N/A'
                },
                
                // Informações de Clipboard
                clipboard: {
                    available: 'clipboard' in navigator
                },
                
                // Informações de Battery
                battery: {
                    available: 'getBattery' in navigator
                },
                
                // Informações de Vibration
                vibration: {
                    available: 'vibrate' in navigator
                },
                
                // Informações de Fullscreen
                fullscreen: {
                    available: !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
                },
                
                // Informações de Web Audio
                webAudio: {
                    available: !!(window.AudioContext || window.webkitAudioContext)
                },
                
                // Informações de Web Speech
                webSpeech: {
                    speechSynthesis: 'speechSynthesis' in window,
                    speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
                },
                
                // Informações de Web Share
                webShare: {
                    available: 'share' in navigator
                },
                
                // Informações de Payment Request
                paymentRequest: {
                    available: 'PaymentRequest' in window
                },
                
                // Informações de Web Bluetooth
                webBluetooth: {
                    available: 'bluetooth' in navigator
                },
                
                // Informações de Web USB
                webUSB: {
                    available: 'usb' in navigator
                },
                
                // Informações de Web Workers
                webWorkers: {
                    available: typeof Worker !== 'undefined'
                },
                
                // Informações de SharedArrayBuffer
                sharedArrayBuffer: {
                    available: typeof SharedArrayBuffer !== 'undefined'
                },
                
                // Informações de BigInt
                bigInt: {
                    available: typeof BigInt !== 'undefined'
                },
                
                // Informações de Symbol
                symbol: {
                    available: typeof Symbol !== 'undefined'
                },
                
                // Informações de Proxy
                proxy: {
                    available: typeof Proxy !== 'undefined'
                },
                
                // Informações de Map
                map: {
                    available: typeof Map !== 'undefined'
                },
                
                // Informações de Set
                set: {
                    available: typeof Set !== 'undefined'
                },
                
                // Informações de Promise
                promise: {
                    available: typeof Promise !== 'undefined'
                },
                
                // Informações de Generator
                generator: {
                    available: (function*(){}).constructor !== undefined
                },
                
                // Informações de Async/Await
                asyncAwait: {
                    available: (async function(){}).constructor !== undefined
                },
                
                // Informações de Classes
                classes: {
                    available: (class {}).constructor !== undefined
                },
                
                // Informações de Modules
                modules: {
                    available: typeof window.import !== 'undefined' || typeof importScripts !== 'undefined'
                }
            }
        };
    }

    // Função para obter informações da GPU
    getGPUVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    // Detectar se é software fallback
                    if (vendor && vendor.toLowerCase().includes('software')) {
                        return `${vendor} (Software Fallback)`;
                    }
                    return vendor || 'N/A';
                }
            }
            return 'N/A';
        } catch (error) {
            return 'N/A';
        }
    }

    getGPURenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    // Detectar se é software fallback
                    if (renderer && renderer.toLowerCase().includes('software')) {
                        return `${renderer} (Software Fallback)`;
                    }
                    return renderer || 'N/A';
                }
            }
            return 'N/A';
        } catch (error) {
            return 'N/A';
        }
    }

    getGPUVersion() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                return gl.getParameter(gl.VERSION) || 'N/A';
            }
            return 'N/A';
        } catch (error) {
            return 'N/A';
        }
    }

    // Função para determinar o tipo de dispositivo
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
            return 'Mobile/Tablet';
        } else if (/desktop|laptop|pc|macintosh|windows/.test(userAgent)) {
            return 'Desktop';
        } else {
            return 'Unknown';
        }
    }

    // Função para obter tipos de entrada disponíveis
    getInputTypes() {
        const inputTypes = [];
        
        // Verificar suporte a touch
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            inputTypes.push('Touch');
        }
        
        // Verificar suporte a mouse
        if ('onmousedown' in window) {
            inputTypes.push('Mouse');
        }
        
        // Verificar suporte a teclado
        if ('onkeydown' in window) {
            inputTypes.push('Keyboard');
        }
        
        // Verificar suporte a gamepad
        if ('getGamepads' in navigator) {
            inputTypes.push('Gamepad');
        }
        
        return inputTypes.length > 0 ? inputTypes.join(', ') : 'N/A';
    }

    // Função para obter informações de sensores
    getSensorInfo() {
        const sensors = [];
        
        // Verificar suporte a acelerômetro
        if ('Accelerometer' in window) {
            sensors.push('Accelerometer');
        }
        
        // Verificar suporte a giroscópio
        if ('Gyroscope' in window) {
            sensors.push('Gyroscope');
        }
        
        // Verificar suporte a magnetômetro
        if ('Magnetometer' in window) {
            sensors.push('Magnetometer');
        }
        
        // Verificar suporte a orientação
        if ('DeviceOrientationEvent' in window) {
            sensors.push('DeviceOrientation');
        }
        
        // Verificar suporte a movimento
        if ('DeviceMotionEvent' in window) {
            sensors.push('DeviceMotion');
        }
        
        return sensors.length > 0 ? sensors.join(', ') : 'N/A';
    }

    // Função para verificar suporte WebGL
    getWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const vendor = gl.getParameter(gl.VENDOR);
                const renderer = gl.getParameter(gl.RENDERER);
                
                // Detectar se é software fallback
                const isSoftwareFallback = 
                    vendor.toLowerCase().includes('software') ||
                    renderer.toLowerCase().includes('software') ||
                    renderer.toLowerCase().includes('swiftshader') ||
                    renderer.toLowerCase().includes('mesa');
                
                return {
                    supported: true,
                    version: gl.getParameter(gl.VERSION),
                    vendor: vendor,
                    renderer: renderer,
                    isSoftwareFallback: isSoftwareFallback,
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
                };
            }
            return { supported: false, reason: 'WebGL não suportado' };
        } catch (error) {
            return { supported: false, reason: `Erro: ${error.message}` };
        }
    }

    // Função para obter extensões WebGL
    getWebGLExtensions() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const extensions = gl.getSupportedExtensions();
                return {
                    count: extensions ? extensions.length : 0,
                    list: extensions || [],
                    debugInfo: gl.getExtension('WEBGL_debug_renderer_info') ? 'Disponível' : 'Não disponível'
                };
            }
            return { count: 0, list: [], debugInfo: 'N/A' };
        } catch (error) {
            return { count: 0, list: [], debugInfo: `Erro: ${error.message}` };
        }
    }

    // Função para obter informações de rede (métodos alternativos)
    getNetworkInfo() {
        const networkInfo = {
            // API depreciada (ainda tenta usar se disponível)
            legacy: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData,
                downlinkMax: navigator.connection.downlinkMax || 'N/A',
                type: navigator.connection.type || 'N/A'
            } : null,
            
            // Métodos alternativos
            online: navigator.onLine,
            connectionType: this.detectConnectionType(),
            saveData: this.detectSaveData(),
            webRTC: this.getWebRTCInfo()
        };

        return networkInfo;
    }

    // Detectar tipo de conexão baseado no user agent e outras pistas
    detectConnectionType() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Detectar mobile
        if (/mobile|android|iphone|ipad/.test(userAgent)) {
            return 'Mobile';
        }
        
        // Detectar desktop
        if (/desktop|laptop|pc|macintosh|windows/.test(userAgent)) {
            return 'Desktop';
        }
        
        return 'Unknown';
    }

    // Detectar se está em modo de economia de dados
    detectSaveData() {
        // Verificar se a API ainda existe
        if (navigator.connection && navigator.connection.saveData !== undefined) {
            return navigator.connection.saveData;
        }
        
        // Verificar headers de economia de dados
        if (navigator.connection && navigator.connection.effectiveType) {
            return navigator.connection.effectiveType === 'slow-2g' || 
                   navigator.connection.effectiveType === '2g';
        }
        
        return 'N/A';
    }

    // Obter informações WebRTC (IPs locais)
    getWebRTCInfo() {
        try {
            if (!window.RTCPeerConnection) {
                return { available: false, reason: 'WebRTC não suportado' };
            }
            
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            
            const ips = [];
            
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate.candidate;
                    const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
                    if (ipMatch) {
                        ips.push(ipMatch[1]);
                    }
                }
            };
            
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            
            // Timeout após 2 segundos
            setTimeout(() => {
                pc.close();
            }, 2000);
            
            return { available: true, note: 'IPs serão coletados em background' };
            
        } catch (error) {
            return { available: false, error: error.message };
        }
    }

    displayClientInfo(data) {
        const container = document.getElementById('clientInfo');
        container.innerHTML = '';
        
        // Informações do cliente
        const clientInfo = data.client_data;
        const serverInfo = data.server_info;
        
        // Seção de informações do navegador
        const browserSection = document.createElement('div');
        browserSection.className = 'info-section';
        browserSection.innerHTML = '<h4><i class="fas fa-globe"></i> Navegador</h4>';
        
        const browserItems = [
            { label: 'User Agent', value: clientInfo.browser.userAgent },
            { label: 'Idioma', value: clientInfo.browser.language },
            { label: 'Idiomas Suportados', value: clientInfo.browser.languages.join(', ') },
            { label: 'Plataforma', value: clientInfo.browser.platform },
            { label: 'Vendor', value: clientInfo.browser.vendor },
            { label: 'Cookies', value: clientInfo.browser.cookieEnabled ? 'Habilitado' : 'Desabilitado' },
            { label: 'Online', value: clientInfo.browser.onLine ? 'Sim' : 'Não' },
            { label: 'Do Not Track', value: clientInfo.browser.doNotTrack || 'Não especificado' },
            { label: 'App Name', value: clientInfo.browser.appName },
            { label: 'App Version', value: clientInfo.browser.appVersion }
        ];
        
        browserItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            browserSection.appendChild(div);
        });
        
        // Seção de informações da tela
        const screenSection = document.createElement('div');
        screenSection.className = 'info-section';
        screenSection.innerHTML = '<h4><i class="fas fa-desktop"></i> Tela</h4>';
        
        const screenItems = [
            { label: 'Resolução', value: `${clientInfo.screen.width}x${clientInfo.screen.height}` },
            { label: 'Resolução Disponível', value: `${clientInfo.screen.availWidth}x${clientInfo.screen.availHeight}` },
            { label: 'Profundidade de Cor', value: `${clientInfo.screen.colorDepth} bits` },
            { label: 'Pixel Depth', value: `${clientInfo.screen.pixelDepth} bits` },
            { label: 'Orientação', value: clientInfo.screen.orientation }
        ];
        
        screenItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            screenSection.appendChild(div);
        });
        
        // Seção de informações da janela
        const windowSection = document.createElement('div');
        windowSection.className = 'info-section';
        windowSection.innerHTML = '<h4><i class="fas fa-window-maximize"></i> Janela</h4>';
        
        const windowItems = [
            { label: 'Largura Interna', value: `${clientInfo.window.innerWidth}px` },
            { label: 'Altura Interna', value: `${clientInfo.window.innerHeight}px` },
            { label: 'Largura Externa', value: `${clientInfo.window.outerWidth}px` },
            { label: 'Altura Externa', value: `${clientInfo.window.outerHeight}px` },
            { label: 'Device Pixel Ratio', value: clientInfo.window.devicePixelRatio },
            { label: 'Posição X', value: `${clientInfo.window.screenX}px` },
            { label: 'Posição Y', value: `${clientInfo.window.screenY}px` }
        ];
        
        windowItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            windowSection.appendChild(div);
        });
        
        // Seção de informações de hardware
        const hardwareSection = document.createElement('div');
        hardwareSection.className = 'info-section';
        hardwareSection.innerHTML = '<h4><i class="fas fa-microchip"></i> Hardware</h4>';
        
        const hardwareItems = [
            { label: 'Núcleos de CPU', value: clientInfo.hardware.cores },
            { label: 'Memória do Dispositivo', value: clientInfo.hardware.memory !== 'N/A' ? `${clientInfo.hardware.memory} GB` : 'N/A' },
            { label: 'Pontos de Toque Máximos', value: clientInfo.hardware.maxTouchPoints }
        ];
        
        hardwareItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            hardwareSection.appendChild(div);
        });
        
        // Seção de informações de rede
        const networkSection = document.createElement('div');
        networkSection.className = 'info-section';
        networkSection.innerHTML = '<h4><i class="fas fa-wifi"></i> Rede</h4>';
        
        const connection = clientInfo.performance.connection;
        const networkItems = [
            { 
                label: 'Status Online', 
                value: connection.online ? 'Conectado' : 'Desconectado' 
            },
            { 
                label: 'Tipo de Dispositivo', 
                value: connection.connectionType || 'N/A' 
            },
            { 
                label: 'Modo de Economia', 
                value: connection.saveData === true ? 'Ativado' : 
                       connection.saveData === false ? 'Desativado' : 'N/A' 
            },
            { 
                label: 'WebRTC', 
                value: connection.webRTC.available ? 'Disponível' : 'Não disponível' 
            }
        ];

        // Adicionar informações legadas se disponíveis
        if (connection.legacy) {
            networkItems.push(
                { label: 'Tipo de Conexão (Legacy)', value: connection.legacy.effectiveType || 'N/A' },
                { label: 'Velocidade (Legacy)', value: connection.legacy.downlink ? `${connection.legacy.downlink} Mbps` : 'N/A' },
                { label: 'RTT (Legacy)', value: connection.legacy.rtt ? `${connection.legacy.rtt} ms` : 'N/A' }
            );
        }
        
        networkItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            networkSection.appendChild(div);
        });
        
        // Seção de informações do servidor
        const serverSection = document.createElement('div');
        serverSection.className = 'info-section';
        serverSection.innerHTML = '<h4><i class="fas fa-server"></i> Informações do Servidor</h4>';
        
        const serverItems = [
            { label: 'IP do Cliente', value: serverInfo.server_ip },
            { label: 'Host', value: serverInfo.host },
            { label: 'Referer', value: serverInfo.referer || 'N/A' },
            { label: 'X-Forwarded-For', value: serverInfo.forwarded_for || 'N/A' },
            { label: 'X-Real-IP', value: serverInfo.real_ip || 'N/A' },
            { label: 'Session ID', value: data.session_id },
            { label: 'Timestamp', value: new Date(serverInfo.timestamp).toLocaleString() }
        ];
        
        serverItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-item';
            div.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            serverSection.appendChild(div);
        });
        
        container.appendChild(browserSection);
        container.appendChild(screenSection);
        container.appendChild(windowSection);
        container.appendChild(hardwareSection);
        container.appendChild(networkSection);
        container.appendChild(serverSection);
    }

    async exportReport() {
        this.showLoading();
        
        try {
            // Coletar informações do cliente
            const clientData = this.getClientInfo();
            
            // Enviar para o servidor para gerar relatório
            const response = await fetch('/api/export-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Criar e baixar arquivo JSON
                const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `client-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                this.showError(`Erro ao exportar relatório: ${data.error}`);
            }
        } catch (error) {
            this.showError(`Erro de conexão: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    // Métodos auxiliares para coleta de informações
    getGPUVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                }
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    getGPURenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    getGPUVersion() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                return gl.getParameter(gl.VERSION);
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
            return 'Mobile/Tablet';
        } else if (/desktop|laptop|pc|mac|windows/.test(userAgent)) {
            return 'Desktop';
        }
        return 'Unknown';
    }

    getInputTypes() {
        const inputs = [];
        if ('ontouchstart' in window) inputs.push('Touch');
        if ('onmousedown' in window) inputs.push('Mouse');
        if ('onkeydown' in window) inputs.push('Keyboard');
        if ('onwheel' in window) inputs.push('Wheel');
        if ('ongamepadconnected' in window) inputs.push('Gamepad');
        return inputs;
    }

    getSensorInfo() {
        const sensors = [];
        if ('Accelerometer' in window) sensors.push('Accelerometer');
        if ('Gyroscope' in window) sensors.push('Gyroscope');
        if ('Magnetometer' in window) sensors.push('Magnetometer');
        if ('AmbientLightSensor' in window) sensors.push('AmbientLightSensor');
        if ('ProximitySensor' in window) sensors.push('ProximitySensor');
        if ('LinearAccelerationSensor' in window) sensors.push('LinearAccelerationSensor');
        if ('GravitySensor' in window) sensors.push('GravitySensor');
        return sensors;
    }

    getWebGLVersion() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                return gl.getParameter(gl.VERSION);
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ClientInfoApp();
});