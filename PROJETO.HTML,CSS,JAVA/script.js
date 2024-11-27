document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const formPage = document.getElementById('form-page');
    const savedPage = document.getElementById('saved-page');
    const gamePage = document.getElementById('game-page');
    const toggleFormButton = document.getElementById('toggle-form-button');
    const toggleGamesButton = document.getElementById('toggle-games-button');
    const backToHomeButton = document.getElementById('back-to-home');
    const backToFormButton = document.getElementById('back-to-form');
    const backToHomeGameButton = document.getElementById('back-to-home-game');
    const mario = document.querySelector('.mario');
    const pipe = document.querySelector('.pipe');
    const gameOverElement = document.querySelector('.game-over');
    const gameMusic = document.getElementById('game-music');
    const gameOverMusic = document.getElementById('game-over-music');
    const phoneInput = document.getElementById('phone');
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const form = document.querySelector('.js-form');
    const saveButton = document.getElementById('save-button');
    const peopleList = document.getElementById('people-list');
    const distanceDisplay = document.getElementById('distance');
    const recordDisplay = document.getElementById('record');
    const startButton = document.getElementById('start-button');
    let isJumping = false;
    let distance = 0;
    let record = 0;
    let gameInterval;
    let pipeSpeed = 4000; // Velocidade inicial do pipe
    let isGameOver = false;
    let editIndex = null;

    toggleFormButton.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        formPage.classList.remove('hidden');
    });

    toggleGamesButton.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        gamePage.classList.remove('hidden');
    });

    backToHomeButton.addEventListener('click', () => {
        formPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    backToFormButton.addEventListener('click', () => {
        savedPage.classList.add('hidden');
        formPage.classList.remove('hidden');
    });

    backToHomeGameButton.addEventListener('click', () => {
        gamePage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        gameMusic.pause();
        gameMusic.currentTime = 0;
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
    });

    const startGame = () => {
        distance = 0;
        pipeSpeed = 4000; // Velocidade inicial do pipe
        pipe.style.animationDuration = `${pipeSpeed}ms`;
        gameMusic.play();
        gameOverElement.style.display = 'none';
        startButton.style.display = 'none';
        isGameOver = false;

        setTimeout(() => {
            pipe.classList.add('pipe-animation');
            gameInterval = setInterval(() => {
                distance += 0.1;
                distanceDisplay.textContent = `Distância: ${distance.toFixed(1)} km`;

                if (pipeSpeed > 2000) {
                    pipeSpeed -= 100; // Aumenta a velocidade do pipe gradualmente
                    pipe.style.animationDuration = `${pipeSpeed}ms`;
                }
            }, 100);
        }, 4000); // Atraso de 4 segundos antes do início do movimento do pipe
    };

    const resetGame = () => {
        clearInterval(gameInterval);
        pipe.classList.remove('pipe-animation');
        pipe.style.right = '0';
        mario.src = 'img/mario.gif';
        mario.style.width = '150px';
        mario.style.bottom = '0';
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
        gameMusic.pause();
        gameMusic.currentTime = 0;
        startButton.style.display = 'block';
        distanceDisplay.textContent = 'Distância: 0 km';
        isGameOver = false;
    };

    const jump = () => {
        if (isJumping || isGameOver) return;
        isJumping = true;
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
            isJumping = false;
        }, 800);
    };

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            pipe.classList.remove('pipe-animation');
            pipe.style.left = `${pipePosition}px`;

            mario.style.bottom = `${marioPosition}px`;
            mario.src = 'img/game-over.png';
            mario.style.width = '80px';
            mario.style.marginLeft = '50px';

            gameMusic.pause();
            gameOverMusic.play();

            gameOverElement.style.display = 'flex';
            clearInterval(gameInterval);
            isGameOver = true;

            if (distance > record) {
                record = distance;
                recordDisplay.textContent = `Recorde: ${record.toFixed(1)} km`;
                alert('Parabéns! Você ultrapassou o recorde!');
            }

            setTimeout(() => {
                resetGame();
                startButton.style.display = 'block';
            }, 3000); // Reinicia o jogo automaticamente após 3 segundos
        }
    }, 10);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            if (isGameOver) {
                resetGame();
            } else {
                jump();
            }
        }
    });

    document.addEventListener('touchstart', (event) => {
        if (event.touches.length) {
            if (isGameOver) {
                resetGame();
            } else {
                jump();
            }
        }
    });

    startButton.addEventListener('click', startGame);

    // Formatação automática do número de celular
    phoneInput.addEventListener('input', () => {
        let phone = phoneInput.value.replace(/\D/g, '');
        phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2');
        phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
        phoneInput.value = phone;
    });

    // Formatação automática do CEP e preenchimento do endereço
    cepInput.addEventListener('input', () => {
        let cep = cepInput.value.replace(/\D/g, '');
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
        cepInput.value = cep;

        if (cep.length === 9) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        logradouroInput.value = data.logradouro;
                        bairroInput.value = data.bairro;
                        cidadeInput.value = data.localidade;
                        ufInput.value = data.uf;
                    } else {
                        logradouroInput.value = '';
                        bairroInput.value = '';
                        cidadeInput.value = '';
                        ufInput.value = '';
                    }
                })
                .catch(error => console.error('Erro ao buscar o CEP:', error));
        }
    });

    // Função para salvar o cadastro
    saveButton.addEventListener('click', () => {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const person = {
            name: formData.get('Nome'),
            birthDate: formData.get('Data de Nascimento'),
            email: formData.get('Email'),
            phone: formData.get('Celular'),
            cep: formData.get('CEP'),
            logradouro: formData.get('Logradouro'),
            bairro: formData.get('Bairro'),
            cidade: formData.get('Cidade'),
            uf: formData.get('UF')
        };

        if (editIndex !== null) {
            updatePerson(editIndex, person);
        } else {
            addPerson(person);
        }

        form.reset();
        editIndex = null;
        formPage.classList.add('hidden');
        savedPage.classList.remove('hidden');
    });

    function addPerson(person) {
        const personCard = createPersonCard(person);
        peopleList.appendChild(personCard);
    }

    function updatePerson(index, person) {
        const personCards = peopleList.querySelectorAll('.person-card');
        const personCard = createPersonCard(person);
        peopleList.replaceChild(personCard, personCards[index]);
    }

    function createPersonCard(person) {
        const card = document.createElement('div');
        card.classList.add('person-card');
        card.innerHTML = `
            <p>Nome: ${person.name}</p>
            <p>Data de Nascimento: ${person.birthDate}</p>
            <p>Email: ${person.email}</p>
            <p>Celular: ${person.phone}</p>
            <p>CEP: ${person.cep}</p>
            <p>Logradouro: ${person.logradouro}</p>
            <p>Bairro: ${person.bairro}</p>
            <p>Cidade: ${person.cidade}</p>
            <p>UF: ${person.uf}</p>
            <button class="edit-button">Editar</button>
            <button class="delete-button">Remover</button>
        `;

        card.querySelector('.edit-button').addEventListener('click', () => {
            editPerson(card);
        });

        card.querySelector('.delete-button').addEventListener('click', () => {
            deletePerson(card);
        });

        return card;
    }

    function editPerson(card) {
        const personCards = Array.from(peopleList.querySelectorAll('.person-card'));
        editIndex = personCards.indexOf(card);

        const person = {
            name: card.querySelector('p:nth-child(1)').textContent.replace('Nome: ', ''),
            birthDate: card.querySelector('p:nth-child(2)').textContent.replace('Data de Nascimento: ', ''),
            email: card.querySelector('p:nth-child(3)').textContent.replace('Email: ', ''),
            phone: card.querySelector('p:nth-child(4)').textContent.replace('Celular: ', ''),
            cep: card.querySelector('p:nth-child(5)').textContent.replace('CEP: ', ''),
            logradouro: card.querySelector('p:nth-child(6)').textContent.replace('Logradouro: ', ''),
            bairro: card.querySelector('p:nth-child(7)').textContent.replace('Bairro: ', ''),
            cidade: card.querySelector('p:nth-child(8)').textContent.replace('Cidade: ', ''),
            uf: card.querySelector('p:nth-child(9)').textContent.replace('UF: ', '')
        };

        form.querySelector('#name').value = person.name;
        form.querySelector('#birth-date').value = person.birthDate;
        form.querySelector('#email').value = person.email;
        form.querySelector('#phone').value = person.phone;
        form.querySelector('#cep').value = person.cep;
        form.querySelector('#logradouro').value = person.logradouro;
        form.querySelector('#bairro').value = person.bairro;
        form.querySelector('#cidade').value = person.cidade;
        form.querySelector('#uf').value = person.uf;

        mainPage.classList.add('hidden');
        formPage.classList.remove('hidden');
    }

    function deletePerson(card) {
        peopleList.removeChild(card);
    }

    // Função para atualizar o relógio digital
    function updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Chamada inicial para exibir o relógio imediatamente
});