$(document).ready(function () {
    var beneficiarios = []; // beneficiarios como variável global - detalhe

    function atualizarTabelaBeneficiarios() {
        var tabela = $("#tabelaBeneficiarios tbody");
        tabela.empty();

        beneficiarios.forEach(function (beneficiario, index) {
            tabela.append('<tr>' +
                '<td>' + beneficiario.cpf + '</td>' +
                '<td>' + beneficiario.nome + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="alterarBeneficiario(' + index + ')">Alterar</button> ' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="excluirBeneficiario(' + index + ')">Excluir</button>' +
                '</td>' +
                '</tr>');
        });
    }

    // Validação de CPF no formato 000.000.000-00
    function validarCPF(cpf) {
        var regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return regex.test(cpf);
    }

    $("#adicionarBeneficiario").click(function () {
        var nome = $("#beneficiarioNome").val().trim();
        console.log("Nome :", nome);
        var cpf = $("#beneficiarioCPF").val().trim();
        console.log("CPF: ", cpf);

        if (!validarCPF(cpf)) {
            alert("CPF inválido. Por favor, use o formato 000.000.000-00.");
            return;
        }

        if (beneficiarios.some(b => b.cpf === cpf)) {
            alert("Já existe um beneficiário com esse CPF.");
            return;
        }

        beneficiarios.push({ nome: nome, cpf: cpf });
        atualizarTabelaBeneficiarios();

        // Limpa os campos
        $("#beneficiarioNome").val('');
        $("#beneficiarioCPF").val('');
    });

    document.getElementById("SalvarId").addEventListener("click", () => {
        

        const IdNumber = $("#CPF").val();
        const IdFormated = IdNumber.replace(".", "").replace("-", "");
        console.log(IdFormated.replace(".", ""));
        fetch('/Cliente/Incluir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: IdFormated.replace(".", ""),
                CEP: $("#CEP").val(),
                Cidade: $("#Cidade").val(),
                Email: $("#Email").val(),
                Estado: $("#Estado").val(),
                Logradouro: $("#Logradouro").val(),
                Nacionalidade: $("#Nacionalidade").val(),
                Nome: $("#Nome").val(),
                Sobrenome: $("#Sobrenome").val(),
                Telefone: $("#Telefone").val(),
                CPF: $("#CPF").val() 
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Erro ao adicionar cliente!");
            }
            return response.json();
        }).then(data => {
            adicionarBeneficiarioBD($("#CPF").val());
        }).catch(error => {
            console.log("Error: ", error);
        })

    })

    function adicionarBeneficiarioBD(CPF) {
        console.log(beneficiarios);
        for (let i = 0; i < beneficiarios.length; i++) {
            const IdNumber = beneficiarios[i].cpf;
            const IdFormated = IdNumber.replace(".", "").replace("-", "");
            fetch('/Beneficiario/Incluir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clienteCPF: CPF,
                    Id: IdFormated.replace(".", ""),
                    Nome: `${beneficiarios[i].nome}`,
                    CPF: `${beneficiarios[i].cpf}`
                })
            })
        }
    }

    

    window.alterarBeneficiario = function (index) {
        var beneficiario = beneficiarios[index];
        $("#beneficiarioNome").val(beneficiario.nome);
        $("#beneficiarioCPF").val(beneficiario.cpf);

        // Remove o beneficiário da lista para ser re-adicionado com as alterações
        excluirBeneficiario(index);
    };

    window.excluirBeneficiario = function (index) {
        beneficiarios.splice(index, 1);
        atualizarTabelaBeneficiarios();
    };

    // Atualiza o grid de beneficiários
    function atualizarGridBeneficiarios() {
        $.ajax({
            url: '/Beneficiario/BeneficiarioList',
            method: 'POST',
            success: function (data) {
                $('#beneficiarioGrid').empty();
                data.Records.forEach(function (beneficiario) {
                    $('#beneficiarioGrid').append(
                        '<tr>' +
                        '<td>' + beneficiario.Nome + '</td>' +
                        '<td>' + beneficiario.CPF + '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function (xhr) {
                alert("Erro ao carregar beneficiários: " + xhr.responseText);
            }
        });
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: 'application/json', // Define o tipo de conteúdo como JSON
            data: JSON.stringify({
                "NOME": $("#Nome").val(),
                "CEP": $("#CEP").val(),
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val(),
                "CPF": $("#CPF").val(),
                "Beneficiarios": beneficiarios
            }),
            success: function (response) {
                ModalDialog("Sucesso!", response);
                $("#formCadastro")[0].reset();
                beneficiarios = []; // Limpa a lista de beneficiários após salvar
                atualizarTabelaBeneficiarios(); // Atualiza a tabela para exibir a lista vazia
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            }
        });
    });
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var dialogHtml = '<div id="' + random + '" class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '<h4 class="modal-title">' + titulo + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>' + texto + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('body').append(dialogHtml);
    $('#' + random).modal('show');
}
