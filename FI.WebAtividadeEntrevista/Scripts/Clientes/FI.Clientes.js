$(document).ready(function () {
    var beneficiarios = [];

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
        var cpf = $("#beneficiarioCPF").val().trim();

        if (!validarCPF(cpf)) {
            ModalDialog("CPF Inválido", "CPF inválido. Por favor, use o formato 000.000.000-00.");
            return;
        }

        if (beneficiarios.some(b => b.cpf === cpf)) {
            ModalDialog("CPF Duplicado", "Já existe um beneficiário com esse CPF.");
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
            if (beneficiarios.length > 0) {
                adicionarBeneficiarioBD($("#CPF").val());
            } else {
                ModalDialog("Sucesso!", "Cliente adicionado com sucesso.");
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }).catch(error => {
            console.log("Error: ", error);
        });
    });

    function adicionarBeneficiarioBD(CPF) {
        const requests = beneficiarios.map(beneficiario => {
            const IdFormated = beneficiario.cpf.replace(".", "").replace("-", "");
            return fetch('/Beneficiario/Incluir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clienteCPF: CPF,
                    Id: IdFormated.replace(".", ""),
                    Nome: beneficiario.nome,
                    CPF: beneficiario.cpf
                })
            });
        });

        Promise.all(requests)
            .then(responses => {
                responses.forEach(response => {
                    if (!response.ok) {
                        throw new Error("Erro ao adicionar Beneficiário!");
                    }
                });
                // Exibe mensagem de sucesso e recarrega a página
                ModalDialog("Sucesso!", "Cliente e beneficiários adicionados com sucesso.");
                setTimeout(() => {
                    location.reload();
                }, 2000); // Delay de 2 segundos para exibir a mensagem antes de recarregar
            })
            .catch(error => {
                console.log("Error: ", error);
            });
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
