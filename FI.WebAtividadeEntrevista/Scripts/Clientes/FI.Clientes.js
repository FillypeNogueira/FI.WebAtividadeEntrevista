
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

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

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var clienteData = {
            "NOME": $(this).find("#Nome").val(),
            "CEP": $(this).find("#CEP").val(),
            "Email": $(this).find("#Email").val(),
            "Sobrenome": $(this).find("#Sobrenome").val(),
            "Nacionalidade": $(this).find("#Nacionalidade").val(),
            "Estado": $(this).find("#Estado").val(),
            "Cidade": $(this).find("#Cidade").val(),
            "Logradouro": $(this).find("#Logradouro").val(),
            "Telefone": $(this).find("#Telefone").val(),
            "CPF": $(this).find("#CPF").val(),
            "Beneficiarios": beneficiarios // Adiciona a lista de beneficiários
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(clienteData),
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });
});

$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
            },
            success: function (data) {
                alert("Cliente cadastrado com sucesso!");

                // Limpa os campos do formulário após a inserção
                $('#formCadastro')[0].reset();

                // Atualizar o grid de beneficiários
                atualizarGridBeneficiarios();
            },
            error: function (data) {
                alert("Erro ao cadastrar o cliente: " + data.responseText);
            }
        });
    });

    $('#btnInserirBeneficiario').click(function () {
        let nome = $('#NomeBeneficiario').val();
        let cpf = $('#CPFBeneficiario').val();

        $.ajax({
            url: '/Beneficiario/Incluir',  // URL do seu controller para adicionar o beneficiário
            method: "POST",
            data: {
                Nome: nome,
                CPF: cpf,
                IdCliente: clienteId // ID do cliente
            },
            success: function (response) {
                alert(response); // Mensagem de sucesso

                // Atualiza o grid de beneficiários
                atualizarGridBeneficiarios();

                // Limpa os campos do modal após a inserção
                $('#NomeBeneficiario').val('');
                $('#CPFBeneficiario').val('');
            },
            error: function (xhr) {
                alert(xhr.responseText); // Mensagem de erro
            }
        });
    });

    function atualizarGridBeneficiarios() {
        $.ajax({
            url: '/Beneficiario/BeneficiarioList',  // URL da controller para listar beneficiários
            method: 'POST',
            success: function (data) {
                // Limpa o grid
                $('#beneficiarioGrid').empty();

                // Renderiza os novos beneficiários no grid
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
});

