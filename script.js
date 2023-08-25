// Obtém referências para os elementos HTML
const cepInput = document.getElementById('cepInput');
const searchButton = document.getElementById('searchButton');
const addButton = document.getElementById('addButton');
const resultContainer = document.getElementById('resultContainer');
const logradouro = document.getElementById('logradouro');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('estado');
const userList = document.getElementById('userList');

// Objeto para armazenar o endereço atual
let currentAddress = null;

// Listener para o botão de busca
searchButton.addEventListener('click', async () => {
    const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP possui 8 dígitos
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
            logradouro.textContent = data.logradouro || 'Não encontrado';
            bairro.textContent = data.bairro || 'Não encontrado';
            cidade.textContent = data.localidade || 'Não encontrado';
            estado.textContent = data.uf || 'Não encontrado';
            resultContainer.classList.remove('hidden'); // Exibe o resultado
            document.getElementById('cepResult').textContent = `CEP: ${cep}`;
            currentAddress = { ...data, cep: cep };
        } else {
            resultContainer.classList.add('hidden');
            alert('CEP não encontrado. Verifique o CEP informado.');
        }
    }
});

// Listener para o botão de adicionar
addButton.addEventListener('click', () => {
    if (currentAddress) {
        if (!isAddressInList(currentAddress)) {
            saveData(currentAddress); // Salva o endereço no banco de dados
            alert('Endereço adicionado ao banco de dados!');
            fetchUsers(); // Atualiza a lista de usuários
        } else {
            alert('Endereço já existe na lista.');
        }
    } else {
        alert('Não há endereço para adicionar. Primeiro, clique em "Buscar".');
    }
});

// Função para verificar se um endereço já está na lista
function isAddressInList(address) {
    const userListRows = userList.querySelectorAll('tr');
    for (const row of userListRows) {
        const cepCell = row.querySelector('td:nth-child(5)');
        if (cepCell.textContent === address.cep) {
            return true;
        }
    }
    return false;
}

// Listener para o evento de carregamento da página
window.addEventListener('load', fetchUsers);

// Função para buscar e exibir a lista de usuários
function fetchUsers() {
    fetch('get_users.php')
    .then(response => response.json())
    .then(result => {
        if (result.users) {
            userList.innerHTML = ''; // Limpa a lista antes de preenchê-la novamente
            result.users.forEach(user => {
                const row = userList.insertRow();
                const logradouroCell = row.insertCell(0);
                const bairroCell = row.insertCell(1);
                const cidadeCell = row.insertCell(2);
                const estadoCell = row.insertCell(3);
                const cepCell = row.insertCell(4);
                const deleteButtonCell = row.insertCell(5);

                logradouroCell.textContent = user.logradouro;
                bairroCell.textContent = user.bairro;
                cidadeCell.textContent = user.cidade;
                estadoCell.textContent = user.estado;
                cepCell.textContent = user.cep;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => {
                    deleteUser(user.cep);
                });
                deleteButtonCell.appendChild(deleteButton);
            });
        }
    });
}

// Função para salvar os dados do endereço no banco de dados
function saveData(data) {
    const formData = new FormData();
    formData.append('cep', data.cep);
    formData.append('logradouro', data.logradouro);
    formData.append('bairro', data.bairro);
    formData.append('cidade', data.localidade);
    formData.append('estado', data.uf);

    fetch('save.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message); // Exibe a mensagem do servidor no console
    });
}

// Função para excluir um usuário da lista

function deleteUser(cep) {
    fetch(`delete.php?cep=${cep}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        fetchUsers();
    });
}
