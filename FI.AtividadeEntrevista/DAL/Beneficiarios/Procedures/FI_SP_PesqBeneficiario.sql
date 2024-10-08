﻿CREATE PROC FI_SP_PesqBeneficiario
    @iniciarEm INT,
    @quantidade INT,
    @campoOrdenacao VARCHAR(200),
    @crescente BIT
AS
BEGIN
    DECLARE @SCRIPT NVARCHAR(MAX);
    DECLARE @CAMPOS NVARCHAR(MAX);
    DECLARE @ORDER VARCHAR(50);

    -- Definindo a ordenação baseada no campo fornecido
    IF(@campoOrdenacao = 'NOME')
        SET @ORDER = ' NOME ';
    ELSE
        SET @ORDER = ' NOME '; 
    IF(@crescente = 0)
        SET @ORDER = @ORDER + ' DESC';
    ELSE
        SET @ORDER = @ORDER + ' ASC';

    SET @CAMPOS = '@iniciarEm INT, @quantidade INT';
    SET @SCRIPT = 
    'SELECT ID, NOME, CPF FROM
        (SELECT ROW_NUMBER() OVER (ORDER BY ' + @ORDER + ') AS Row, ID, NOME, CPF FROM BENEFICIARIOS WITH(NOLOCK))
        AS BeneficiariosWithRowNumbers
    WHERE Row > @iniciarEm AND Row <= (@iniciarEm + @quantidade)
    ORDER BY ' + @ORDER;

    EXECUTE SP_EXECUTESQL @SCRIPT, @CAMPOS, @iniciarEm, @quantidade;

    SELECT COUNT(1) FROM BENEFICIARIOS WITH(NOLOCK);
END
