﻿$(function () {
    HentAlleStasjoner();
});

function HentAlleStasjoner() {
    $.get("bestilling/hentAlleStasjoner", function (stasjoner) {
        if (stasjoner) {
            listStartStasjoner(stasjoner);
        } else {
            $("#feil").html("Feil i db");
        }
    });
}

function listStartStasjoner(stasjoner) {
    let ut = "<select onchange='listEndeStasjoner()' id='startstasjon'> ";
    ut += "<option>Velg startstasjon</option>";
    for (let stasjon of stasjoner) {
        ut += "<option>" + stasjon.stasjonsNavn + "</option>";
    }
    ut += "</select>";
    $("#startstasjon").html(ut);
    console.log(JSON.stringify(stasjoner));
}

function listEndeStasjoner() {
    let startstasjon = $('#startstasjon option:selected').text();
    console.log("StartStasjon: " + startstasjon);
    const url = "bestilling/hentEndeStasjoner?startStasjonsNavn=" + startstasjon;
    $.get(url, function (stasjoner) {
        if (stasjoner) {
            let ut = "<label>Jeg skal reise til:</label>";
            ut += "<select onchange='listDato()' class='endestasjoner'>";
            ut += "<option>Velg endestasjon</option>";
            let forrigeStasjon = "";
            for (let stasjon of stasjoner) {
                if (stasjon.stasjonsNavn !== forrigeStasjon) {
                    ut += "<option>" + stasjon.stasjonsNavn + "</option>";
                }
                forrigeStasjon = stasjon.stasjonsNavn;
            }
            ut += "</select>";
            $("#endestasjon").html(ut);
            console.log(JSON.stringify(stasjoner));
        } else {
            $("#feil").html("Feil i db");
        }
    });
}

function listDato() {
    let ut = "<label>Velg dato<span> (DD/MM/ÅÅÅÅ) </span></label>";
    ut += "<input type='text' id='datoValgt' onchange='listTidspunkt(), validerDato(this.value)'>";
    $("#dato").html(ut);
}

function listTidspunkt() {
    let dato = document.getElementById('datoValgt').value;
    let startstasjon = $('#startstasjon option:selected').text();
    let endestasjon = $('#endestasjon option:selected').text();
    console.log("Dato: " + dato + ", startstasjon: " + startstasjon + ", endestasjon: " + endestasjon);
    const url = "bestilling/hentAlleTurer";
    $.get(url, function (turer) {
        if (turer) {
            let ut = "<label>Velg tidspunkt</label>";
            ut += "<select id='tidspunkt'>";
            for (let tur of turer) {
                console.log("Utenfor if, tur sin tid:" + tur.tid);
                if (startstasjon === tur.startStasjon.stasjonsNavn && endestasjon === tur.endeStasjon.stasjonsNavn && dato === tur.dato) {
                    ut += "<option>" + tur.tid + "</option>";
                    console.log("Tur sin tid:" + tur.tid);
                }
            }
            ut += "</select>";
            $("#tid").html(ut);
            console.log(JSON.stringify(turer));
        }
        else {
            $("#feil").html("Feil i db");
        }
    });
}

function beregnPris() {
    let dato = document.getElementById('datoValgt').value;
    let startstasjon = $('#startstasjon option:selected').text();
    let endestasjon = $('#endestasjon option:selected').text();
    let tid = $('#tid option:selected').text();
    let antallBarn = $("#antallBarn").val();
    let antallVoksne = $("#antallVoksne").val();

    let pris;
    let barnepris = 0;
    let voksenpris = 0;

    const url = "bestilling/hentAlleTurer";
    $.get(url, function (turer) {
        if (turer) {
            for (let tur of turer) {
                if (startstasjon === tur.startStasjon.stasjonsNavn && endestasjon === tur.endeStasjon.stasjonsNavn && dato === tur.dato && tid == tur.tid) {
                    console.log("tur.barnepris: " + tur.barnePris + ", antallBarn: " + antallBarn + ", tur.voksenPris: " + tur.voksenPris + ", antallVoksne: " + antallVoksne);
                    barnepris = tur.barnePris;
                    voksenpris = tur.voksenPris;
                }
            }
            if (antallBarn > 0 && antallVoksne > 0) {
                pris = (barnepris * antallBarn) + (voksenpris * antallVoksne);
            }
            else if (antallBarn <= 0 && antallVoksne > 0) {
                pris = voksenpris * antallVoksne;
            }
            else if (antallVoksne <= 0 && antallBarn > 0) {
                pris = barnepris * antallBarn;
            }
            else {
                pris = 0;
            }
            console.log("Beregnet pris: " + pris);
        }
        else {
            $("#feil").html("Feil i db");
        }
    });
}

function beregnOgValiderBarn() {
    let antallBarn = $("#antallBarn").val();
    validerAntallBarn(antallBarn);
    beregnPris();
}

function beregnOgValiderVoksen() {
    let antallVoksne = $("#antallVoksne").val();
    validerAntallVoksne(antallVoksne);
    beregnPris();
}

function validerOgLagBestilling() {
    const StartstasjonOK = validerStartstasjon($("#startstasjon").val());
    const EndestasjonOK = validerEndestasjon($("#endestasjon").val());
    const FornavnOK = validerFornavn($("#fornavn").val());
    const EtternavnOK = validerEtternavn($("#etternavn").val());
    const TelefonnummerOK = validerTelefonnummer($("#telefonnr").val());
    const AntallBarnOK = validerAntallBarn($("#antallBarn").val());
    const AntallVoksneOK = validerAntallVoksne($("#antallVoksne").val());
    if (StartstasjonOK && EndestasjonOK  && FornavnOK && EtternavnOK && TelefonnummerOK && AntallBarnOK && AntallVoksneOK) {
        lagreBestilling();
    }
}

function genererPopUP() {
    window.confirm("hei på deg");
    
}


function lagMinEgenPopUp() {

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("reg");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Når man trykker på avslutt så blir popupen borte.*/
    avslutt.onclick = function () {
        modal.style.display = "none";
    }


}

function sjekkValidering() {
    
    if (lagreBestilling == true) {
        return lagMinEgenPopUp();
    }
    else {

        $("#feil").html("Feil i validering");
    }
}

function lagreBestilling() {
    const bestilling = {
        //sette inn id?
        startstasjon: $("#startstasjon").val(),
        endeStasjon: $("#endestasjon").val(),
        fornavn: $("#fornavn").val(),
        etternavn: $("#etternavn").val(),
        telefonnummer: $("#telefonnr").val(),
        antallBarn: $("#antallBarn").val(),
        antallVoksne: $("#antallVoksne").val()
        //totalPris: $("#totalPris").val(),
        //tid: $("#tid").val(),
    };

    if (ingenValideringsFeil()) {
        const url = "bestilling/lagre";
        $.post(url, bestilling, function () {
            window.location.href = 'index.html';
        })
            .fail(function () {
                $("#feil").html("Feil på server - prøv igjen senere");
            });
    }
}



