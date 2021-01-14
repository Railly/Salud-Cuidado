const express = require('express');
const router = express.Router();

const pool = require('../database');



router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    console.log(req.body);
    let sexo;

    let claves = Object.keys(req.body);

    let {edad, sexoMasculino, sexoFemenino,
        arterioesclerosis, diabetes, cardiovascular, 
        hepatica, neurologica, pulmonar, renal, hipertension, 
        inmunodeficiencia, obesidad, cancer, dolorPecho, 
        dolorCabeza, dolorGarganta, tasaRespiratoria,
        saturacionOxigeno } = req.body;

    if(sexoMasculino == 'on') {
        sexo = 1;       
    }

    if(sexoFemenino == 'on') {
        sexo = 0;
    }

    let arr = {
        edad,
        sexo,
        arterioesclerosis,
        diabetes,
        cardiovascular,
        hepatica,
        neurologica,
        pulmonar,
        renal,
        hipertension,
        inmunodeficiencia,
        obesidad,
        cancer,
        dolorCabeza,
        dolorGarganta,
        dolorPecho,
        tasaRespiratoria,
        saturacionOxigeno
    }

    let claves1 = Object.keys(arr);

    for(let i=0; i< claves1.length; i++){
        let clave1 = claves1[i];
        if(arr[clave1] == undefined) {
            arr[clave1] =  0;
        }
        if(arr[clave1] == 'on') {
            arr[clave1] =  1;
        }
    }

    edad = arr['edad']
    sexo = arr['sexo']
    arterioesclerosis = arr['arterioesclerosis']
    diabetes = arr['diabetes']
    enfermedad_cardiovascular = arr['cardiovascular']
    enfermedad_hepatica = arr['hepatica']
    enfermedad_neurologica = arr['neurologica']
    enfermedad_pulmonar = arr['pulmonar']
    enfermedad_renal = arr['renal']
    hipertension = arr['hipertension']
    inmunodeficiencia = arr['inmunodeficiencia']
    obesidad = arr['obesidad']
    cancer = arr['cancer']
    dolor_cabeza = arr['dolorCabeza']
    dolor_garganta = arr['dolorGarganta']
    dolor_pecho = arr['dolorPecho']
    tasa_respiratoria = arr['tasaRespiratoria']
    saturacion_oxigeno = arr['saturacionOxigeno']

    const newSurvey = {
        edad,
        sexo,
        tasa_respiratoria,
        saturacion_oxigeno,
        usuario_id: req.user.usuario_id,
    };

    console.log(newSurvey);


    const encuesta1 = await pool.query('INSERT INTO encuesta set ?', [newSurvey]);
    newSurvey.encuesta_id = encuesta1.insertId;

    const newSurveyRiskFactors = {
        arterioesclerosis,
        diabetes,
        enfermedad_cardiovascular,
        enfermedad_hepatica,
        enfermedad_neurologica,
        enfermedad_pulmonar,
        enfermedad_renal,
        hipertension,
        inmunodeficiencia,
        obesidad,
        cancer,
        encuesta_id: newSurvey.encuesta_id
    };


    console.log(newSurveyRiskFactors);


    const riesgo1 = await pool.query('INSERT INTO factor_riesgo set ?', [newSurveyRiskFactors]);
    
    const newPainType = {
        dolor_pecho,
        dolor_cabeza,
        dolor_garganta,
        encuesta_id: newSurvey.encuesta_id,
    }

    console.log(newPainType);


    const dolor1 = await pool.query('INSERT INTO tipo_dolor set ?', [newPainType]);

    res.redirect('resultado');
    //res.send('received');
});

router.get('/', async(req, res) => {
    //const survey = await pool.query('SELECT * FROM encuesta');
    const users = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [req.user.usuario_id]);
    // res.render('resultados/list', { survey });
    res.render('links/list', { users });
    console.log(users);
})


router.get('/sobre-nosotros', (req, res) => {
    res.render('about');
})


router.get('/resultado', async (req, res) => {
    const usuario = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [req.user.usuario_id]);
    // console.log(usuario[0]);
    const encuesta = await pool.query('SELECT * FROM encuesta WHERE usuario_id = ?', [req.user.usuario_id]);

    const survey = encuesta[0];
    // console.log(survey);

    const encuesta_identificador = encuesta[0].encuesta_id;

    const factor_riesgo = await pool.query('SELECT * FROM factor_riesgo WHERE encuesta_id = ?', [encuesta_identificador])
    // console.log(factor_riesgo[0]);

    const tipo_dolor = await pool.query('SELECT * FROM tipo_dolor WHERE encuesta_id', [encuesta_identificador])
    // console.log(tipo_dolor[0]);

    /* OMS Algorithm COVID-19 */
    let { encuesta_id, edad, sexo, tasa_respiratoria, saturacion_oxigeno} = survey;
    sexo = parseInt(sexo);

    const { arterioesclerosis, diabetes, enfermedad_cardiovascular, 
        enfermedad_hepatica, enfermedad_neurologica, enfermedad_pulmonar, enfermedad_renal, hipertension, 
        inmunodeficiencia, obesidad, cancer } =  factor_riesgo[0]
    
    const riskPoints = arterioesclerosis + diabetes + enfermedad_cardiovascular + enfermedad_hepatica + enfermedad_neurologica +
                        enfermedad_pulmonar + enfermedad_renal + hipertension + inmunodeficiencia + obesidad + cancer;
    // console.log("riskPoints: ", riskPoints);

    const { dolor_pecho, dolor_cabeza, dolor_garganta } = tipo_dolor[0]

    let nivel_riesgo;
    
    if(saturacion_oxigeno < 94 || tasa_respiratoria > 20 || dolor_pecho || dolor_cabeza || dolor_garganta) {
        if(riskPoints >= 1) {   
            if(saturacion_oxigeno < 90 || tasa_respiratoria > 24) {
                survey.recomendacion = "Riesgo alto, debe ir al hospital inmediatamente";
                nivel_riesgo = {riesgo: 'alto'};
                
            } else {
                survey.recomendacion = "Riesgo medio, consulte a su médico regularmente.";
                nivel_riesgo = {riesgo: 'medio'};
            }
        } else {
            if(tasa_respiratoria > 18 || tasa_respiratoria < 12 || dolor_pecho) {
                survey.recomendacion = "Riesgo bajo, pero se recomienda consultar a su médico";
                nivel_riesgo = {riesgo: 'bajo'};
            } else {
                survey.recomendacion = "Riesgo bajo, no hay pistas de un posible contagio de COVID-19";
                nivel_riesgo = {riesgo: 'bajo'};
            }
        }
    } else {
        if(riskPoints == 0) {
            survey.recomendacion = "Riesgo bajo, se recomienda hacerse un chequeo tradicional";
            nivel_riesgo = {riesgo: 'bajo'};
        } else {
            survey.recomendacion = "Riesgo medio, consulte a su médico regularmente.";
            nivel_riesgo = {riesgo: 'medio'};
        }
    }

    await pool.query('UPDATE encuesta SET nivel_riesgo = ? WHERE encuesta_id = ?', [nivel_riesgo.riesgo, encuesta_identificador]);
    
    res.render('resultado', { survey });
})

module.exports = router;