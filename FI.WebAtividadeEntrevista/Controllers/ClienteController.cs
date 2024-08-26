using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Reflection;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(long Id, string CEP, string Cidade,  string Email, string Estado, string Logradouro, string Nacionalidade, string Nome, string Sobrenome, string Telefone, string CPF)
        {
            Bo bo = new Bo();
            BoCliente boClient = new BoCliente();

            ClienteModel model = new ClienteModel(
                Id = Id,
                CEP = CEP,
                Cidade  = Cidade,
                Email = Email,
                Estado = Estado,
                Logradouro = Logradouro,
                Nacionalidade = Nacionalidade,
                Nome = Nome,
                Sobrenome = Sobrenome,
                Telefone = Telefone,
                CPF = CPF
                );

            if (!bo.ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("CPF inválido. Por favor, verifique os dados e tente novamente.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (boClient.VerificarExistencia(model.CPF))
                {
                    Response.StatusCode = 400;
                    return Json("O CPF informado já pertence a um cliente. Insira um CPF válido");
                }

                model.Id = boClient.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });
                               
                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            //BoCliente bo = new BoCliente();
            //Cliente cliente = bo.Consultar(id);
            //Models.ClienteModel model = null;

            //if (cliente != null)
            //{
            //    model = new ClienteModel()
            //    {
            //        Id = cliente.Id,
            //        CEP = cliente.CEP,
            //        Cidade = cliente.Cidade,
            //        Email = cliente.Email,
            //        Estado = cliente.Estado,
            //        Logradouro = cliente.Logradouro,
            //        Nacionalidade = cliente.Nacionalidade,
            //        Nome = cliente.Nome,
            //        Sobrenome = cliente.Sobrenome,
            //        Telefone = cliente.Telefone,
            //        CPF = cliente.CPF
            //    };


            //}

            //return View(model);
            return Json("Teste");
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}