using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.UI.Entities;

namespace Web.UI.Services
{
    public static class MeetingGeneratorHelper
    {
        private static readonly string[] MeetingNames = new[]
        {
            "Mati", "Beth", "Sofi", "Mara", "Jorge", "Luis", "Noe", "David", "Juan", "James"
        };

        public static Task<Meeting> Generate()
        {
            Meeting Juntada = new Meeting();
            
            var rng = new Random();
            var friends = FriendGeneratorHelper.Generate();

            Juntada.Id = 1;
            Juntada.Name = $"Juntada {MeetingNames[rng.Next(MeetingNames.Length)]}";
            Juntada.Date = DateTime.Now;
            Juntada.Friends = friends;
            Juntada.TotalAmount = friends.Sum(t => t.Amount);
            Juntada.CxpAmount = friends.Sum(t => t.Amount) / Convert.ToDecimal(friends.Count);

            List<Payer> Deudores = new List<Payer>();
            List<Collector> Cobradores = new List<Collector>();
            List<Payment> Pagos = new List<Payment>();

            for (var l = 0; l < friends.Count; l++)
            {
                var amigo = friends[l];

                if (amigo.Amount < Juntada.CxpAmount)
                {
                    var deudor = new Payer();
                    deudor.PayerFriend = amigo;
                    deudor.DebitBalance = Juntada.CxpAmount - amigo.Amount;
                    Deudores.Add(deudor);
                }
                else
                {
                    var cobrador = new Collector();
                    cobrador.CollertorFriend = amigo;
                    cobrador.CollectingBalance = amigo.Amount - Juntada.CxpAmount;
                    Cobradores.Add(cobrador);
                }
            }

            Juntada.Payers = Deudores;
            Juntada.Collectors = Cobradores;

            Payer _deudor = null;
            Collector _cobrador = null;
            Payment _pago = null;
            decimal montoPagar = 0;
            int i = 0;
            int j = 0;

            for (i = 0; i < Juntada.Payers.Count; i++)
            {
                _deudor = Juntada.Payers[i];

                while (_deudor.DebitBalance != 0)
                {
                    for (j = 0; j < Juntada.Collectors.Count; j++)
                    {
                        _cobrador = Juntada.Collectors[j];
                        if (_cobrador.CollectingBalance != 0)
                        {
                            break;
                        }
                    }

                    if (_deudor.DebitBalance >= _cobrador.CollectingBalance)
                    {
                        montoPagar = _cobrador.CollectingBalance;
                    }
                    else
                    {
                        montoPagar = _deudor.DebitBalance;
                    }
                    

                    _deudor.DebitBalance -= montoPagar;
                    _cobrador.CollectingBalance -= montoPagar;

                    Juntada.Payers[i] = _deudor;
                    Juntada.Collectors[j] = _cobrador;

                    _pago = new Payment();

                    _pago.FriendCollector = _cobrador;
                    _pago.FriendPayer = _deudor;
                    _pago.PaymentAmount = montoPagar;
                    _pago.RoundedPaymentAmount = Math.Round(montoPagar, 0);

                    Pagos.Add(_pago);
                }
            }

            Juntada.Payments = Pagos;

            return Task.FromResult(Juntada);
        }
    }
}
