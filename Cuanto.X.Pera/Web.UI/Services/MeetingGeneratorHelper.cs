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

        static Meeting Juntada;

        public static Task<Meeting> Generate()
        {
            Juntada = new Meeting();

            var rng = new Random();
            var friends = FriendGeneratorHelper.Generate();

            Juntada.Id = 1;
            Juntada.Name = $"Juntada {MeetingNames[rng.Next(MeetingNames.Length)]}";
            Juntada.Date = DateTime.Now;
            Juntada.Friends = friends;
            
            Calculate();

            return Task.FromResult(Juntada);
        }


        private static void Calculate()
        {
            Juntada.Payments = null;
            if (Juntada.Friends.Count >= 2)
            {
                Juntada.TotalAmount = Juntada.Friends.Sum(t => t.Amount);
                Juntada.CxpAmount = Math.Round(Juntada.Friends.Sum(t => t.Amount) / Convert.ToDecimal(Juntada.Friends.Count), 2);

                List<Payer> Deudores = new List<Payer>();
                List<Collector> Cobradores = new List<Collector>();
                List<Payment> Pagos = new List<Payment>();

                for (int l = 0; l < Juntada.Friends.Count; l++)
                {
                    Friend amigo = Juntada.Friends[l];

                    if (amigo.Amount < Juntada.CxpAmount)
                    {
                        Payer deudor = new Payer();
                        deudor.PayerFriend = amigo;
                        deudor.DebitBalance = Juntada.CxpAmount - amigo.Amount;
                        Deudores.Add(deudor);
                        deudor = null;
                    }
                    else
                    {
                        Collector cobrador = new Collector();
                        cobrador.CollertorFriend = amigo;
                        cobrador.CollectingBalance = amigo.Amount - Juntada.CxpAmount;
                        Cobradores.Add(cobrador);
                        cobrador = null;
                    }

                    amigo = null;
                }

                Juntada.Payers = Deudores;
                Juntada.Collectors = Cobradores;

                Deudores = null;
                Cobradores = null;


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

                        if (j == Juntada.Collectors.Count)
                        {
                            break;
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

                        //hacer debug con 200, 0 y 900

                        _pago = new Payment();

                        _pago.FriendCollector = _cobrador;
                        _pago.FriendPayer = _deudor;
                        _pago.PaymentAmount = Math.Round(montoPagar, 2);
                        _pago.RoundedPaymentAmount = Math.Round(montoPagar, 2);

                        Pagos.Add(_pago);
                    }
                }

                Juntada.Payments = Pagos;

                Juntada.ShareResultText = "";
                foreach (var pago in Juntada.Payments)
                {
                    var titulo = "";
                    if (Juntada.ShareResultText.Trim() == "")
                    {
                        titulo = "¡Repartamos los pagos con Cuanto x Pera!\n\n";
                    }
                    Juntada.ShareResultText += (titulo + pago.FriendPayer.PayerFriend.Name + " le tiene que pagar a " + pago.FriendCollector.CollertorFriend.Name + " $" + pago.RoundedPaymentAmount.ToString() + ".\n\n");
                }
            }
        }
    }
}
