-- -----------------------------------------------------
-- Schema saludcuidado
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `saludcuidado` DEFAULT CHARACTER SET utf8 ;
USE `saludcuidado` ;

-- -----------------------------------------------------
-- Table `saludcuidado`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saludcuidado`.`usuario` (
  `usuario_id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `apellido` VARCHAR(255) NULL DEFAULT NULL,
  `contrasenia` VARCHAR(255) NULL DEFAULT NULL,
  `correo_electronico` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`usuario_id`))

-- -----------------------------------------------------
-- Table `saludcuidado`.`encuesta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saludcuidado`.`encuesta` (
  `encuesta_id` INT(11) NOT NULL AUTO_INCREMENT,
  `edad` INT(11) NOT NULL,
  `sexo` CHAR(1) NOT NULL,
  `tasa_respiratoria` INT(11) NOT NULL,
  `saturacion_oxigeno` INT(11) NOT NULL,
  `nivel_riesgo` CHAR(8) NOT NULL,
  `usuario_id` INT(11) NOT NULL,
  PRIMARY KEY (`encuesta_id`),
  INDEX `encuesta_usuarios_idx` (`usuario_id` ASC),
  CONSTRAINT `encuesta_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `saludcuidado`.`usuario` (`usuario_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
-- -----------------------------------------------------
-- Table `saludcuidado`.`factor_riesgo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saludcuidado`.`factor_riesgo` (
  `factor_riesgo_id` INT(11) NOT NULL AUTO_INCREMENT,
  `arterioesclerosis` TINYINT(4) NULL DEFAULT NULL,
  `diabetes` TINYINT(4) NULL DEFAULT NULL,
  `enfermedad_cardiovascular` TINYINT(4) NULL DEFAULT NULL,
  `enfermedad_hepatica` TINYINT(4) NULL DEFAULT NULL,
  `enfermedad_neurologica` TINYINT(4) NULL DEFAULT NULL,
  `enfermedad_pulmonar` TINYINT(4) NULL DEFAULT NULL,
  `enfermedad_renal` TINYINT(4) NULL DEFAULT NULL,
  `hipertension` TINYINT(4) NULL DEFAULT NULL,
  `inmunodeficiencia` TINYINT(4) NULL DEFAULT NULL,
  `obesidad` TINYINT(4) NULL DEFAULT NULL,
  `cancer` TINYINT(4) NULL DEFAULT NULL,
  `encuesta_id` INT(11) NOT NULL,
  PRIMARY KEY (`factor_riesgo_id`),
  INDEX `factor_riesgo_encuestas_idx` (`encuesta_id` ASC),
  CONSTRAINT `factor_riesgo_encuestas`
    FOREIGN KEY (`encuesta_id`)
    REFERENCES `saludcuidado`.`encuesta` (`encuesta_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
-- -----------------------------------------------------
-- Table `saludcuidado`.`tipo_dolor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saludcuidado`.`tipo_dolor` (
  `tipo_dolor_id` INT(11) NOT NULL AUTO_INCREMENT,
  `dolor_pecho` TINYINT(4) NULL DEFAULT NULL,
  `dolor_cabeza` TINYINT(4) NULL DEFAULT NULL,
  `dolor_garganta` TINYINT(4) NULL DEFAULT NULL,
  `encuesta_id` INT(11) NOT NULL,
  PRIMARY KEY (`tipo_dolor_id`),
  INDEX `tipo_dolor_encuesta_idx` (`encuesta_id` ASC),
  CONSTRAINT `tipo_dolor_encuesta`
    FOREIGN KEY (`encuesta_id`)
    REFERENCES `saludcuidado`.`encuesta` (`encuesta_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)