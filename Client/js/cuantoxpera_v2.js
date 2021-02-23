var db;

var lenDeudores, h, idDeudor, nombreDeudor, saldoDeudor;
var lenCobradores, j, idCobrador, nombreCobrador, saldoCobrador;
var montoPagar;

var resultadosDeudores;
var resultadosCobradores;

$(document).keypress(function (e) {
    if (e.which == 13) {
        validar_persona();
    }
});

$(document).ready(function () {
    inicializar_sw();
    inicializar_db();
    consultar_amigos();
});



function validar_persona() {
    var nombre = $('#txtNombre').val();
    var monto = $('#txtMonto').val();
    if (nombre == '') {
        $.toast({
            heading: 'Error',
            text: 'Ingresa el Nombre',
            icon: 'error',
            loader: true,
            position: 'top-right'
        });
        $('#txtNombre').focus();
        return;
    }
    if (monto == '') {
        $.toast({
            heading: 'Error',
            text: 'Ingresa el monto',
            icon: 'error',
            loader: true,
            position: 'top-right'
        });
        $('#txtMonto').focus();
        return;
    }

    var idAmigo = 0;

    db.exec('INSERT INTO Amigos (Nombre, Monto) VALUES(?, ?)', [nombre, monto])
        .done(function (Id) {
            console.log('insert Amigo successfully, newly created id : ' + Id);

            idAmigo = Id;

            mostrar_persona(idAmigo, nombre, monto);

            $.toast({
                heading: 'Información',
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
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        });
}

function mostrar_persona(idAmigo, nombre, monto) {
    var li_persona = '<li class="list-group-item" data-idAmigo="' + idAmigo + '">\
                            <span class="badge">'+ monto + '</span >\
                            '+ nombre + '\
                    </li>';
    $('#ul_personas').append(li_persona);
    $('#panel_personas').show();
}

function limpiar() {
    db.exec('DELETE FROM Amigos')
        .done(function (amigosBorrados) {
            console.log('deleted Amigos successfully, rows deleted: ' + amigosBorrados);
            borrarTablas();
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
        })
        .fail(function (err) {
            console.log('oops! something got wrong: ' + err.message);
        });
}

function inicializar_sw() {
    var ruta_sw = 'js/sw.js'
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

    db = new websql.Db("CuantoXPera");

    db.exec('CREATE TABLE IF NOT EXISTS Amigos (idAmigo integer primary key autoincrement, Nombre text, Monto)')
        .done(function () {
            console.log('table Amigos successfully created');
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        })

    db.exec('CREATE TABLE IF NOT EXISTS Joda (idAmigo unique, Nombre, PlataQuePuso, TotalJoda, TotalXPera, TieneQuePagar, TieneQueRecibir)')
        .done(function () {
            console.log('table Joda successfully created');
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        })

    db.exec('CREATE TABLE IF NOT EXISTS Deudores (idAmigo unique, Nombre, SaldoDeudor)')
        .done(function () {
            console.log('table Deudores successfully created');
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        })

    db.exec('CREATE TABLE IF NOT EXISTS Cobradores (idAmigo unique, Nombre, SaldoCobrador)')
        .done(function () {
            console.log('table Cobradores successfully created');
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        })

    db.exec('CREATE TABLE IF NOT EXISTS Pagos (idAmigoDeudor, NombreDeudor, Monto, MontoRedondeado, idAmigoCobrador, NombreAmigoCobrador)')
        .done(function () {
            console.log('table Pagos successfully created');
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        })
}

function consultar_amigos() {
    db.query('SELECT * FROM Amigos')
        .done(function (Amigos) {
            console.log('select on table Amigos successfully');
            console.log(Amigos.length + ' Amigos encontrados');

            for (var i = 0; i < Amigos.length; i++) {

                var Amigo = Amigos[i];

                mostrar_persona(Amigo.idAmigo, Amigo.Nombre, Amigo.Monto);
            }
        })
        .fail(function (err) {
            console.log('oops! something got wrong : ' + err.message);
        });
}

function calcular_joda() {
    borrarTablas();
    guardarTablas();
    //cargarDeudores();
    //cargarCobradores();
    guardarJoda();

    //tx.executeSql('SELECT idAmigo, Nombre, SaldoDeudor FROM Deudores', [], function (tx, resultsD) {
    //    resultadosDeudores = resultsD;
    //    lenDeudores = resultadosDeudores.rows.length;

    //    for (h = 0; h < lenDeudores; h++) {
    //        idDeudor = resultadosDeudores.rows.item(h).idAmigo;
    //        nombreDeudor = resultadosDeudores.rows.item(h).Nombre;
    //        saldoDeudor = resultadosDeudores.rows.item(h).SaldoDeudor;
    //        var monto = saldoDeudor;

    //        db2.transaction(function (tx2) {
    //            tx2.executeSql('SELECT idAmigo, Nombre, SaldoCobrador FROM Cobradores WHERE SaldoCobrador <> 0 ORDER BY SaldoCobrador DESC LIMIT 0,1', [], function (tx2, resultsC) {
    //                lenCobradores = resultsC.rows.length;

    //                for (j = 0; j < lenCobradores; j++) {
    //                    idCobrador = resultsC.rows.item(j).idAmigo;
    //                    nombreCobrador = resultsC.rows.item(j).Nombre;
    //                    saldoCobrador = resultsC.rows.item(j).SaldoCobrador;
    //                }

    //                if (resultadosDeudores.rows.item(i).SaldoDeudor >= saldoCobrador && saldoCobrador != 0) {
    //                    montoPagar = saldoCobrador;
    //                }
    //                else {
    //                    montoPagar = resultadosDeudores.rows.item(i).SaldoDeudor;
    //                }

    //                tx.executeSql("INSERT INTO Pagos \
    //                            SELECT "+ idDeudor + ", '" + nombreDeudor + "', " + montoPagar + ", " + montoPagar + ", " + idCobrador + ", '" + nombreCobrador + "'");

    //                tx.executeSql("UPDATE Cobradores \
    //                            SET SaldoCobrador = SaldoCobrador - " + montoPagar + " \
    //                            WHERE idAmigo = " + idCobrador);

    //            });
    //        });

    //        saldoDeudor = saldoDeudor - montoPagar;
    //    }
    //});
    //});
}

function borrarTablas() {
    var cmd = db.exec('DELETE FROM Joda');
    cmd.then(function (jodasBorradas) {
        console.log('deleted Joda successfully, rows deleted: ' + jodasBorradas);
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });

    var cmd = db.exec('DELETE FROM Deudores');
    cmd.then(function (deudoresBorrados) {
        console.log('deleted Deudores successfully, rows deleted: ' + deudoresBorrados);
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });

    var cmd = db.exec('DELETE FROM Cobradores');
    cmd.then(function (cobradoresBorrados) {
        console.log('deleted Deudores successfully, rows deleted: ' + cobradoresBorrados);
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });

    var cmd = db.exec('DELETE FROM Pagos');
    cmd.then(function (pagosBorrados) {
        console.log('deleted Pagos successfully, rows deleted: ' + pagosBorrados);
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });
}

function guardarTablas() {
    var cmd = db.exec("INSERT INTO Joda \
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
    cmd.then(function () {
        console.log('insert Joda successfully');
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });

    var cmd = db.exec("INSERT INTO Deudores \
            SELECT	idAmigo, \
                    Nombre, \
                    TieneQuePagar \
            FROM Joda \
            WHERE TieneQuePagar <> 0 \
            ORDER BY  TieneQuePagar ASC");
    cmd.then(function () {
        console.log('insert Deudores successfully');
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });

    var cmd = db.exec("INSERT INTO Cobradores \
            SELECT	idAmigo, \
                    Nombre, \
                    TieneQueRecibir \
            FROM Joda \
            WHERE TieneQueRecibir <> 0 \
            ORDER BY TieneQueRecibir DESC");
    cmd.then(function () {
        console.log('insert Cobradores successfully');
    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong: ' + err.message);
    });
}

function cargarDeudores() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT idAmigo, Nombre, SaldoDeudor FROM Deudores', [], function (tx, resultsD) {
            resultadosDeudores = resultsD;
        });
    });
}

function cargarCobradores() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT idAmigo, Nombre, saldoCobrador FROM Cobradores', [], function (tx, resultsD) {
            resultadosCobradores = resultsD;
        });
    });
}

function guardarJoda() {
    var cmd = db.query('SELECT idAmigo, Nombre, SaldoDeudor FROM Deudores ORDER BY SaldoDeudor ASC');
    cmd.then(function (Deudores) {

        console.log('Select On Table Deudores Successfully');
        console.log(Deudores.length + ' Deudores Encontrados');
        console.log('Recorremos Deudores');

        for (var i = 0; i < Deudores.length; i++) {
            var Deudor = Deudores[i];

            var cmd2 = db.query('SELECT idAmigo, Nombre, SaldoCobrador FROM Cobradores WHERE SaldoCobrador <> 0 ORDER BY SaldoCobrador DESC LIMIT 0,1');
            cmd2.then(function (Cobradores) {
                console.log('select on table Cobradores successfully');

                var Cobrador = Cobradores[0];
                console.log(Cobrador.Nombre + ' es el primer Cobrador encontrado para el deudor ' + Deudor.Nombre);
            });
            cmd2.fail(function (err) {
                console.log('oops! something got wrong : ' + err.message);
            });
        }

    });
    cmd.fail(function (err) {
        console.log('oops! something got wrong : ' + err.message);
    });



    //db.query('SELECT idAmigo, Nombre, SaldoDeudor FROM Deudores ORDER BY SaldoDeudor ASC')
    //    .then(function (Deudores) {

    //        console.log('select on table Deudores successfully');
    //        console.log(Deudores.length + ' Deudores encontrados');

    //        for (var i = 0; i < Deudores.length; i++) {
    //            var Deudor = Deudores[i];

    //            return db.query('SELECT idAmigo, Nombre, SaldoCobrador FROM Cobradores WHERE SaldoCobrador <> 0 ORDER BY SaldoCobrador DESC LIMIT 0,1')
    //                .then(function (Cobradores) {

    //                    console.log('select on table Cobradores successfully');
    //                    console.log(Cobradores.length + ' Cobradores encontrados');

    //                    for (var j = 0; j < Cobradores.length; j++) {
    //                        var Cobrador = Cobradores[j];

    //                        console.log('Deudor: ' + Deudor.Nombre + ' - Saldo: ' + Deudor.SaldoDeudor);
    //                        console.log('Cobrador: ' + Cobrador.Nombre + ' - Saldo: ' + Cobrador.SaldoCobrador);

    //                        if (Deudor.SaldoDeudor >= Cobrador.SaldoCobrador && Cobrador.SaldoCobrador != 0) {
    //                            montoPagar = Cobrador.SaldoCobrador;
    //                        }
    //                        else {
    //                            montoPagar = Deudor.SaldoDeudor;
    //                        }

    //                        console.log('Monto a pagar: ' + montoPagar);
    //                        Deudor.SaldoDeudor = Deudor.SaldoDeudor - montoPagar;


    //                        return db.exec('INSERT INTO Pagos (idAmigoDeudor, NombreDeudor, Monto, MontoRedondeado, idAmigoCobrador, NombreAmigoCobrador) VALUES(?, ?, ?, ?, ?, ?)', [Deudor.idAmigo, Deudor.Nombre, montoPagar, montoPagar, Cobrador.idAmigo, Cobrador.Nombre])
    //                            .then(function () {

    //                                return db.exec('UPDATE Cobradores SET SaldoCobrador = SaldoCobrador - ' + montoPagar + ' WHERE idAmigo = ' + Cobrador.idAmigo)
    //                                    .then(function (rows) {
    //                                        console.log('update Cobradores successfully, rows affected : ' + rows);
    //                                    })
    //                                    .fail(function (err) {
    //                                        console.log('oops! something got wrong : ' + err.message);
    //                                    });

    //                            })
    //                            .then(function (Id) {
    //                                console.log('insert Pagos successfully, newly created id : ' + Id);
    //                            })
    //                            .fail(function (err) {
    //                                console.log('oops! something got wrong : ' + err.message);
    //                            });



    //                        if (Deudor.SaldoDeudor != 0) {
    //                            i--;
    //                        }

    //                        console.log('Saldo deudor: ' + Deudor.SaldoDeudor)
    //                    }
    //                })
    //                .fail(function (err) {
    //                    console.log('oops! something got wrong : ' + err.message);
    //                });
    //        }
    //    })
    //    .fail(function (err) {
    //        console.log('oops! something got wrong : ' + err.message);
    //    });
}