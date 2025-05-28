// script.js

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
  
    window.showTab = (id) => {
      tabs.forEach(tab => tab.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    };
  
    showTab('home');
  
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    const disciplinas = JSON.parse(localStorage.getItem('disciplinas')) || [];
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
  
    const formAluno = document.getElementById('formAluno');
    const formDisciplina = document.getElementById('formDisciplina');
    const formNota = document.getElementById('formNota');
  
    const listaAlunos = document.getElementById('listaAlunos');
    const listaDisciplinas = document.getElementById('listaDisciplinas');
    const selectAluno = document.getElementById('selectAluno');
    const selectDisciplina = document.getElementById('selectDisciplina');
    const selectBoletim = document.getElementById('selectBoletim');
    const boletimResultado = document.getElementById('boletimResultado');
  
    function salvarLocalStorage() {
      localStorage.setItem('alunos', JSON.stringify(alunos));
      localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
      localStorage.setItem('notas', JSON.stringify(notas));
    }
  
    function atualizarListas() {
      listaAlunos.innerHTML = alunos.map(a => `<li>${a.nome} - Matrícula: ${a.matricula}</li>`).join('');
      listaDisciplinas.innerHTML = disciplinas.map(d => `<li>${d.nome} (${d.codigo})</li>`).join('');
  
      selectAluno.innerHTML = alunos.map(a => `<option value="${a.matricula}">${a.nome}</option>`).join('');
      selectBoletim.innerHTML = selectAluno.innerHTML;
      selectDisciplina.innerHTML = disciplinas.map(d => `<option value="${d.codigo}">${d.nome}</option>`).join('');
    }
  
    formAluno.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nomeAluno').value;
      const matricula = document.getElementById('matriculaAluno').value;
      alunos.push({ nome, matricula });
      salvarLocalStorage();
      atualizarListas();
      formAluno.reset();
    });
  
    formDisciplina.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nomeDisciplina').value;
      const codigo = document.getElementById('codigoDisciplina').value;
      disciplinas.push({ nome, codigo });
      salvarLocalStorage();
      atualizarListas();
      formDisciplina.reset();
    });
  
    formNota.addEventListener('submit', (e) => {
      e.preventDefault();
      const aluno = selectAluno.value;
      const disciplina = selectDisciplina.value;
      const nota1 = parseFloat(document.getElementById('nota1').value);
      const nota2 = parseFloat(document.getElementById('nota2').value);
      const media = ((nota1 + nota2) / 2).toFixed(1);
      notas.push({ aluno, disciplina, nota1, nota2, media });
      salvarLocalStorage();
      atualizarListas();
      formNota.reset();
      selectBoletim.dispatchEvent(new Event('change'));
    });
  
    selectBoletim.addEventListener('change', () => {
      const matricula = selectBoletim.value;
      const alunoNotas = notas.filter(n => n.aluno === matricula);
      if (alunoNotas.length === 0) {
        boletimResultado.innerHTML = '<p>Nenhuma nota encontrada.</p>';
        return;
      }
      let html = '<table><tr><th>Disciplina</th><th>Nota 1</th><th>Nota 2</th><th>Média</th></tr>';
      alunoNotas.forEach(n => {
        const disc = disciplinas.find(d => d.codigo === n.disciplina);
        html += `<tr><td>${disc?.nome || n.disciplina}</td><td>${n.nota1}</td><td>${n.nota2}</td><td>${n.media}</td></tr>`;
      });
      html += '</table>';
      boletimResultado.innerHTML = html;
    });
  
    atualizarListas();
  });