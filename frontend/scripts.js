let saldo = 0;
let historico = [];

async function login() {
    const username = document.getElementById('username').value.trim();
    const userId = document.getElementById('userId').value.trim();
    const bankCode = document.getElementById('bankCode').value.trim();

    if (username === '' || userId === '' || bankCode === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, username, bankCode })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Login realizado com sucesso!');
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            document.getElementById('userDisplay').textContent = username;
            await consultarSaldo();
            await consultarHistorico();
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

async function depositar() {
    const valor = parseFloat(document.getElementById('depositValue').value);
    const userId = document.getElementById('userId').value.trim();
    if (isNaN(valor) || valor <= 0) {
        alert('Valor de depósito inválido.');
        return;
    }
    try {
        const res = await fetch('http://localhost:3001/api/transacao/depositar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, valor })
        });
        const data = await res.json();
        if (res.ok) {
            await consultarSaldo();
            await consultarHistorico();
            alert('Depósito realizado com sucesso!');
        } else {
            alert(data.error || 'Erro ao depositar.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
    document.getElementById('depositValue').value = '';
}

async function consultarSaldo() {
    const userId = document.getElementById('userId').value.trim();
    try {
        const res = await fetch(`http://localhost:3001/api/saldo/${userId}`);
        const data = await res.json();
        if (res.ok) {
            saldo = parseFloat(data.saldo);
            document.getElementById('saldo').textContent = saldo.toFixed(2);
        }
    } catch {}
}

async function consultarHistorico() {
    const userId = document.getElementById('userId').value.trim();
    try {
        const res = await fetch(`http://localhost:3001/api/historico/${userId}`);
        const data = await res.json();
        if (res.ok) {
            historico = data.historico.map(item => ({
                tipo: item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1),
                valor: parseFloat(item.valor),
                destino: item.destino,
                data: new Date(item.data).toLocaleString()
            }));
            atualizarHistorico();
        }
    } catch {}
}

async function transferir() {
    const valor = parseFloat(prompt('Digite o valor a transferir em USD:'));
    const userId = document.getElementById('userId').value.trim();
    if (isNaN(valor) || valor <= 0) {
        alert('Valor de transferência inválido.');
        return;
    }
    if (valor > saldo) {
        alert('Saldo insuficiente para transferência.');
        return;
    }
    const idDestino = prompt('Digite o ID do cliente/carteira de destino:').trim();
    if (!idDestino) {
        alert('ID do cliente/carteira de destino é obrigatório.');
        return;
    }
    try {
        const res = await fetch('http://localhost:3001/api/transacao/transferir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idOrigem: userId, idDestino, valor })
        });
        const data = await res.json();
        if (res.ok) {
            await consultarSaldo();
            await consultarHistorico();
            alert('Transferência realizada com sucesso!');
        } else {
            alert(data.error || 'Erro ao transferir.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

async function simularPagamento() {
    const usd = parseFloat(document.getElementById('usdValue').value);
    const userId = document.getElementById('userId').value.trim();
    if (isNaN(usd) || usd <= 0) {
        alert('Insira um valor válido para pagar.');
        return;
    }
    if (usd > saldo) {
        alert('Saldo insuficiente para realizar o pagamento.');
        return;
    }
    try {
        const res = await fetch('http://localhost:3001/api/transacao/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, valor: usd })
        });
        const data = await res.json();
        if (res.ok) {
            await consultarSaldo();
            await consultarHistorico();
            document.getElementById('mensagem').textContent = 'Pagamento Simulado com Sucesso!';
            document.getElementById('usdValue').value = '';
            document.getElementById('convertedResult').textContent = '';
        } else {
            alert(data.error || 'Erro ao simular pagamento.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

async function converter() {
    const usd = parseFloat(document.getElementById('usdValue').value);
    const crypto = document.getElementById('cryptoSelect').value;

    if (isNaN(usd) || usd <= 0) {
        alert('Insira um valor válido em USD.');
        return;
    }

    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`);
        const data = await res.json();
        const cotacao = data[crypto].usd;
        const convertido = usd / cotacao;

        document.getElementById('convertedResult').textContent = `Equivalente a ${convertido.toFixed(6)} ${crypto.toUpperCase()}`;
    } catch (error) {
        alert('Erro ao obter cotação da API.');
    }
}

function atualizarHistorico() {
    const historicoDiv = document.getElementById('historico');
    if (!historicoDiv) return;
    historicoDiv.innerHTML = '<h3>Histórico de Operações</h3>' + historico.map(item => {
        if(item.tipo === 'Transferência' || item.tipo === 'Transferencia') {
            return `<div>${item.data} - ${item.tipo}: $${item.valor.toFixed(2)} para ID ${item.destino}</div>`;
        } else if(item.tipo === 'Pagamento') {
            return `<div>${item.data} - ${item.tipo}: $${item.valor.toFixed(2)}</div>`;
        } else {
            return `<div>${item.data} - ${item.tipo}: $${item.valor.toFixed(2)}</div>`;
        }
    }).reverse().join('');
}

// Função para alternar para a tela de cadastro
function showRegister() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('registerMessage').textContent = '';
}

// Função para alternar para a tela de login
function showLogin() {
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
}

// Função de cadastro de usuário
async function cadastrar() {
    const id = document.getElementById('registerId').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const bankCode = document.getElementById('registerBankCode').value.trim();
    const msg = document.getElementById('registerMessage');
    msg.textContent = '';

    if (!id || !username || !bankCode) {
        msg.textContent = 'Preencha todos os campos (ID, Nome e Código do Banco).';
        return;
    }

    try {
        const res = await fetch('http://localhost:3001/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, username, bankCode })
        });
        const data = await res.json();
        if (res.ok) {
            msg.textContent = 'Cadastro realizado com sucesso!';
            // Limpa campos e sugere login
            document.getElementById('registerId').value = '';
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerBankCode').value = '';
            setTimeout(() => {
                showLogin();
                document.getElementById('userId').value = id;
                document.getElementById('username').value = username;
                document.getElementById('bankCode').value = bankCode;
            }, 2000);
        } else {
            msg.textContent = data.error || 'Erro ao cadastrar.';
        }
    } catch (error) {
        msg.textContent = 'Erro de conexão com o servidor.';
    }
}
