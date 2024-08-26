using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace FI.WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficiarioModel
    {
        public BeneficiarioModel(long Id, string Nome, string CPF, long IdCliente)
        {
            Id = Id;
            Nome = Nome;
            CPF = CPF;
            IdCliente = IdCliente;
        }
        public long Id { get; set; }
      
        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}\-\d{2}$", ErrorMessage = "Digite um CPF válido")]
        public string CPF { get; set; }

        /// <summary>
        /// IdCliente
        /// </summary>
        [Required]
        public long IdCliente { get; set; }
    }
}
