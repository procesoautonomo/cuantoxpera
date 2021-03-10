var db;
var db2;
var lenDeudores;
var h;
var idDeudor;
var nombreDeudor;
var saldoDeudor;
var lenCobradores;
var j;
var idCobrador;
var nombreCobrador;
var saldoCobrador;
var montoPagar;
var resultadosDeudores;
var resultadosCobradores;

var validaciones = 0;
$(document).keypress(function (e) {
    if (e.which == 13) {
        validar_persona();
    }
});

$(document).ready(function () {
    inicializar_sw();
    inicializar_db();
    consultar_amigos();
    $('#btnCompartirResultados').hide();
    if (navigator.share) {
        $('#btnCompartirResultados').show();
    }
});

function validar_persona() {
    validaciones++;
    var mostrar_alerta = false;
    var nombre = $('#txtNombre').val();
    var monto = $('#txtMonto').val();
    if (validaciones >= 3) {
        mostrar_alerta = true;
    }
    if (nombre == '') {
        if (mostrar_alerta) {
            $.toast({
                heading: 'Atención',
                text: 'Ingresa el Nombre',
                icon: 'warning',
                loader: true,
                position: 'top-right'
            });
        }
        $('#txtNombre').focus();
        return;
    }
    if (monto == '') {
        if (mostrar_alerta) {
            $.toast({
                heading: 'Atención',
                text: 'Ingresa el monto',
                icon: 'warning',
                loader: true,
                position: 'top-right'
            });
        }
        $('#txtMonto').focus();
        return;
    }

    var idAmigo = 0;

    db.transaction(function (tx) {
        tx.executeSql('SELECT MAX(idAmigo) NEW_ID FROM Amigos', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                idAmigo = results.rows.item(i).NEW_ID;
            }
        }, null);
    });

    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO Amigos (idAmigo, Nombre, Monto) VALUES (' + (idAmigo + 1) + ', "' + nombre + '", ' + monto + ')');
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT MAX(idAmigo) NEW_ID FROM Amigos', [], function (tx, results) {

            var len = results.rows.length, i;

            for (i = 0; i < len; i++) {
                idAmigo = results.rows.item(i).NEW_ID;
            }

            mostrar_persona(idAmigo, nombre, monto);

            $.toast({
                heading: 'Info',
                text: nombre + ' gastó ' + monto,
                icon: 'info',
                loader: true,
                position: 'top-right'
            });

            $('#txtNombre').val('').focus();
            $('#txtMonto').val('');

            $('#btnCalcular').hide();
            if ($('#ul_personas li').length > 1) {
                $('#btnCalcular').show();
            }

        }, null);
    });
}

function mostrar_persona(idAmigo, nombre, monto) {
    validaciones = 0;
    var li_persona = '<li class="bg-red-200 text-sm sm:text-base placeholder-gray-500 pl-1 pr-4 rounded-xl border-4 border-white w-full py-2 focus:outline-none mb-3">\
                            <a class="btn btn-danger btn-xs pull-right btn-eliminar"\
                                data-idAmigo="' + idAmigo + '"\
                                data-nombre="' + nombre + '"\
                                data-monto="' + monto + '"\
                                @click="showModal2 = true" onclick="confirmar_eliminar(this);">\
                                    <span class="glyphicon glyphicon-trash"></span>\
                            </a>&nbsp;&nbsp;\
                            <a class="btn btn-default btn-xs pull-right"\
                                data-idAmigo="' + idAmigo + '"\
                                data-nombre="' + nombre + '"\
                                data-monto="' + monto + '"\
                                onclick="editar(this);">\
                                    <span class="glyphicon glyphicon-edit"></span>\
                             </a>\
                                                        '+ idAmigo + ') ' + nombre + ': $' + monto + '\
                                                      </li>';
    $('#ul_personas').append(li_persona);
    $('#panel_personas').show();
}

function limpiar() {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM Amigos');
        tx.executeSql('DELETE FROM Joda');
        tx.executeSql('DELETE FROM Deudores');
        tx.executeSql('DELETE FROM Cobradores');
        tx.executeSql('DELETE FROM Pagos');
    });

    $.toast({
        heading: 'Información',
        text: "Todos los amigos fueron borrados.",
        icon: 'success',
        loader: true,
        position: 'top-right'
    });
    $('#ul_personas').empty();
    $('#panel_personas').hide();
    $('#modal_confirmar_limpiar').modal('hide');
}

function limpiarModalPagos() {
    $('#ul_personas_pagos').empty();;
}

function inicializar_sw() {
    var ruta_sw = '/sw.js'
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(ruta_sw).then(function () {
            return navigator.serviceWorker.ready;
        }).then(function (reg) {
            console.log('sw registrado ' + reg);
        }).catch(function (error) {
            console.log('Service Worker error :^(', error);
        });
    };
}

function inicializar_db() {
    db = openDatabase('CuantoXPera', '1.0', 'Produccion', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Amigos (idAmigo unique, Nombre, Monto)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Joda (idAmigo unique, Nombre, PlataQuePuso, TotalJoda, TotalXPera, TieneQuePagar, TieneQueRecibir)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Deudores (idAmigo unique, Nombre, SaldoDeudor)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Cobradores (idAmigo unique, Nombre, SaldoCobrador)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Pagos (idAmigoDeudor, NombreDeudor, Monto, MontoRedondeado, idAmigoCobrador, NombreAmigoCobrador)');
    });
}

function consultar_amigos() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Amigos', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                var idAmigo = results.rows.item(i).idAmigo;
                var nombre = results.rows.item(i).Nombre;
                var monto = results.rows.item(i).Monto;
                mostrar_persona(idAmigo, nombre, monto);
            }
        }, null);
    });
}

function calcular_joda() {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM Joda');
        tx.executeSql('DELETE FROM Deudores');
        tx.executeSql('DELETE FROM Cobradores');
        tx.executeSql('DELETE FROM Pagos');

        tx.executeSql("INSERT INTO Joda \
                        SELECT	idAmigo, \
                                Nombre, \
                                Monto, \
                                (SELECT SUM(Monto) FROM Amigos) TOTAL_JODA, \
                                ROUND((SELECT SUM(Monto) FROM Amigos) / (SELECT COUNT(*) FROM Amigos), 2) TOTAL_POR_PERA, \
                                CASE \
                                    WHEN Monto - (SELECT SUM(Monto) FROM Amigos) / (SELECT COUNT(*) FROM Amigos) < 0 THEN ROUND(ABS(Monto - (SELECT SUM(Monto) FROM Amigos) /(SELECT COUNT(*) FROM Amigos)), 2) \
                                    ELSE 0 \
                                END TIENE_QUE_PAGAR, \
                                CASE \
                                    WHEN Monto - (SELECT SUM(Monto) FROM Amigos) / (SELECT COUNT(*) FROM Amigos) > 0 THEN ROUND(Monto - (SELECT SUM(Monto) FROM Amigos) /(SELECT COUNT(*) FROM Amigos), 2) \
                                    ELSE 0 \
                                END TIENE_QUE_RECIBIR \
                        FROM Amigos \
                    ORDER BY TIENE_QUE_RECIBIR DESC, TIENE_QUE_PAGAR ASC");

        tx.executeSql("INSERT INTO Deudores \
                        SELECT	idAmigo, \
                                Nombre, \
                                TieneQuePagar \
                        FROM Joda \
                        WHERE TieneQuePagar <> 0 \
                    ORDER BY  TieneQuePagar ASC");

        tx.executeSql("INSERT INTO Cobradores \
                        SELECT	idAmigo, \
                                Nombre, \
                                TieneQueRecibir \
                        FROM Joda \
                        WHERE TieneQueRecibir <> 0 \
                    ORDER BY TieneQueRecibir DESC");

        tx.executeSql("SELECT TOTALJODA, TOTALXPERA FROM Joda LIMIT 0,1", [], function (tx, totalXpera) {
            j = totalXpera.rows[0].TotalJoda;
            t = totalXpera.rows[0].TotalXPera;
            
            $('#ul_totales_juntada').empty();

            var li_total = '<li class="list-group-item active">\
                            <span class="badge">$'+ j + '</span >\
                            Total Juntada: \
                    </li>';
            $('#ul_totales_juntada').append(li_total);

            $('#ul_totales_pagos').empty();

            var li_persona = '<li class="list-group-item active">\
                            <span class="badge">$'+ t + '</span >\
                            Total X Pera: \
                    </li>';
            $('#ul_totales_pagos').append(li_persona);


            tx.executeSql('SELECT idAmigo, Nombre, SaldoDeudor FROM Deudores ORDER BY SaldoDeudor ASC', [], function (tx, resultsD) {
                resultadosDeudores = resultsD;
                lenDeudores = resultadosDeudores.rows.length;

                tx.executeSql('SELECT idAmigo, Nombre, SaldoCobrador FROM Cobradores WHERE SaldoCobrador <> 0 ORDER BY SaldoCobrador DESC', [], function (tx, resultsC) {
                    resultadosCobradores = resultsC;
                    lenCobradores = resultadosCobradores.rows.length;

                    guardarJoda();
                });

            });

        });
    });
}

function guardarJoda() {
    var _deudores = [];
    var _cobradores = [];
    var _pagos = [];

    for (var i = 0; i < resultadosDeudores.rows.length; i++) {
        var Deudor = resultadosDeudores.rows[i];

        var _d = { idAmigo: Deudor.idAmigo, Nombre: Deudor.Nombre, SaldoDeudor: Deudor.SaldoDeudor };
        _deudores.push(_d);
    }

    for (var j = 0; j < resultadosCobradores.rows.length; j++) {
        var Cobrador = resultadosCobradores.rows[j];

        var _c = { idAmigo: Cobrador.idAmigo, Nombre: Cobrador.Nombre, SaldoCobrador: Cobrador.SaldoCobrador };
        _cobradores.push(_c);
    }

    console.log(_deudores);
    console.log(_cobradores);

    for (var i = 0; i < _deudores.length; i++) {
        var Deudor = _deudores[i];

        while (Deudor.SaldoDeudor != 0) {

            for (var j = 0; j < _cobradores.length; j++) {
                var Cobrador = _cobradores[j];
                if (Cobrador.SaldoCobrador != 0) {
                    break;
                }
            }

            if (Deudor.SaldoDeudor >= Cobrador.SaldoCobrador) {
                montoPagar = Cobrador.SaldoCobrador;
            }
            else {
                montoPagar = Deudor.SaldoDeudor;
            }

            Deudor.SaldoDeudor = Deudor.SaldoDeudor - montoPagar;
            Cobrador.SaldoCobrador = Cobrador.SaldoCobrador - montoPagar;

            _deudores[i] = Deudor;
            _cobradores[j] = Cobrador;

            var _p = {
                idAmigoDeudor: Deudor.idAmigo,
                NombreDeudor: Deudor.Nombre,
                Monto: montoPagar,
                MontoRedondeado: montoPagar,
                idAmigoCobrador: Cobrador.idAmigo,
                NombreAmigoCobrador: Cobrador.Nombre
            };
            _pagos.push(_p);
        }
    }


    db.transaction(function (tx) {
        $('#ul_personas_pagos').empty();
        $('#text_pagos_personas').empty();
        for (var p = 0; p < _pagos.length; p++) {
            var pago = _pagos[p];
            tx.executeSql("INSERT INTO Pagos (idAmigoDeudor, NombreDeudor, Monto, MontoRedondeado, idAmigoCobrador, NombreAmigoCobrador) VALUES (?, ?, ?, ?, ?, ?)",
                [pago.idAmigoDeudor, pago.NombreDeudor, pago.montoPagar, pago.MontoRedondeado, pago.idAmigoCobrador, pago.NombreAmigoCobrador]);

            cargar_pagos_persona(pago.NombreDeudor, pago.NombreAmigoCobrador, pago.MontoRedondeado)
        }
        $('#modal_pagos').modal();
    });
}

function cargar_pagos_persona(NombreDeudor, NombreAmigoCobrador, MontoRedondeado) {

    var li_persona = '<li class="list-group-item">\
                            <span class="badge">$'+ MontoRedondeado + '</span >\
                            '+ NombreDeudor + ' le tiene que pagar a ' + NombreAmigoCobrador + '\
                      </li>';
    $('#ul_personas_pagos').append(li_persona);

    var salto_linea = '';
    if ($('#text_pagos_personas').text() != '') {
        salto_linea = '<br/>';
    }
    $('#text_pagos_personas').append(salto_linea + NombreDeudor + ' le tiene que pagar a ' + NombreAmigoCobrador + ' $' + MontoRedondeado + '. ');
}

function eliminar_amigo(mostrar_toast) {
    var idAmigo = $('#lblAmigo').attr('data-idAmigo');
    var nombre = $('#lblAmigo').text();
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM Amigos WHERE idAmigo = ' + idAmigo, [], function (tx, results) {
            $('.btn-eliminar[data-idAmigo="' + idAmigo + '"]').parent().remove();
            $('#modal_confirmar_eliminar').modal('hide');
            if (mostrar_toast) {
                $.toast({
                    heading: 'Eliminado',
                    text: 'Se eliminaron los gastos de ' + nombre,
                    icon: 'success',
                    loader: true,
                    position: 'top-right'
                });
            }
        }, null);
    });
}

function compartir_resultados() {
    var text_a_pagar = $('#text_pagos_personas').text().trim();
    if (navigator.share) {
        navigator.share({
            title: 'Cuanto x Pera',
            text: text_a_pagar,
            url: 'https://cuantoxpera.com.ar',
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
}

function editar(control) {
    var idAmigo = $(control).attr('data-idAmigo');
    var nombre = $(control).attr('data-nombre');
    var monto = $(control).attr('data-monto');

    $('#lblAmigo').attr('data-idAmigo', idAmigo);
    $('#lblAmigo').text(nombre);

    $('#txtNombre').val(nombre);
    $('#txtMonto').val(monto).focus();

    eliminar_amigo(false);
}

function confirmar_eliminar(control) {
    var idAmigo = $(control).attr('data-idAmigo');
    var nombre = $(control).attr('data-nombre');
    $('#lblAmigo').attr('data-idAmigo', idAmigo);
    $('#lblAmigo').text(nombre);
    // $('#modal_confirmar_eliminar').modal();
}