const WsException = {
    CLOSE_NORMAL: `Conexao fechada normalmente`,
    CLOSE_GOING_AWAY: `O servidor perdeu a conexão buscamento ou o usuário navegou para fora da página que abriu a conexão.`,
    CLOSE_PROTOCOL_ERROR: `O servidor finalizou a conexão devido a um erro de protocolo.`,
    CLOSE_UNSUPPORTED: `A conexão está sendo finalizada pois o servidor recebeu  tipo que não pode ser aceito.`,
    CLOSE_NO_STATUS: `Indica que um código "no status" foi fornecido mesmo que qualquer outro código seja esperado.`,
    CLOSE_ABNORMAL: `Não foi possivel estabelecer a conexão com o servidor.`,
    UNSUPPORTED_DATA: `O servidor está finalizando a conexão por receber mensagem com dados inconsistentes.`,
    POLICY_VIOLATION: `O servidor está finalizando a conexão por ter recebido uma mensagem que viola sua política.`,
    CLOSE_TOO_LARGE: `O servidor está finalizando a conexão pois o "data frame" recebido é muito grande.`,
    MISSING_EXTENSION: `O navegador fechou a conexão devido o não recebimento das extensões corretas do servidor`,
    INTERNAL_ERROR: `O servidor está finalizando uma conexão pois encontrou uma condição inesperada que o impediu de cumprir a solicitação.`,
    SERVICE_RESTART: `O servidor está finalizando a conexão por que ele está reiniciando o processo.`,
    TRY_AGAIN_LATER: `O servidor está finalizando a conexão devido a uma condição temporária. Possivel causa: sobrecarregado e estar rejeitando alguns dos seus clientes.`,
    TLS_HANDSHAKE: `A conexão foi fechada devido a uma falha ao executar o " TLS handshake". Por favor verifique o certificado digital.`,
    DEFAULT_STATUS: `Ocorreu um erro inesperado`,
}

module.exports = { WsException }
