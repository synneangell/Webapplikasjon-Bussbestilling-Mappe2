﻿using System;
namespace WebapplikasjonerOppgave1.DAL
{
    public class Bestilling
    {
        public int BId {get; set;}
        public virtual Kunde Kunde { get; set; }
        public int AntallBarn { get; set; }
        public int AntallVoksne { get; set; }
        public double TotalPris { get; set; }
        public virtual Tur Tur { get; set; }
    }
}
