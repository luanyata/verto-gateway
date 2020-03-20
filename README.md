# Verto-gateway

Biblioteca simplificada para comunicação entre o front-end com o [Freeswith](https://freeswitch.org/confluence/display/FREESWITCH/Introduction) utilizando o [mod_verto](https://freeswitch.org/confluence/display/FREESWITCH/mod_verto) para realizar audio chamadas, video-chamadas, video-conferencia e troca de mensagem de texto utilizando Websokect e SIP.

ps.: No momemto apenas audio chamada está implementada

## Instalação:

O projeto ainda se encontro em processo de desenvolvimento por isso ainda não publicado no NPM. Para usar você deverá puxar a lib do github. Para isso basta adicionar a linha abaixo no seu `package.json`:

```json
"verto-gateway": "git+https://github.com/luanyata/verto-gateway.git#dev"
```

Em seguida realize a instalação do mesmo com seu gerenciar de pacotes:

**NPM**:

```shell
npm install
```

**YARN**:

```shell
yarn install
```

Agora carregue os javascripts no seu HTML antes dos seus javascript:

```html
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../lib/node_modules/jquery-json/dist/jquery.json.min.js"></script>
<script src="../node_modules/verto/src/jquery.verto.js"></script>
<script src="../node_modules/verto/src/jquery.FSRTC.js"></script>
<script src="../node_modules/verto/src/jquery.jsonrpcclient.js"></script>
```

## Utilizando

### **Tag Audio:**

Para que o audio das chamadas sejam executada, é necessario a criação da `tag audio` seguindo algumas recomendações:

-   Deve conter um ID que será utilizado na configuração para reporduzir o audio da chamada
-   Deve ter a propriedade autoplay
-   Opcionalmente ter a propriedade hidden para que o play de audio não seja exibido na tela

```html
<audio id="call" hidden autoplay></audio>
```

### **Config:**

**Start:**

Resposavel por registrar o ramal

```javascript
import { Config } from 'verto-gateway'

Config.start('parametro')
```

**Parametros**:

-   agent
    -   login: usuário do ramal
    -   passwd: senha do ramal
-   wssAddress: endereço do servidor wss
-   wsFallbackURL: array de string contendo os endereços de outros servidores wss para ser acionados em casos de falha. Caso nao tenha o valor pode ser omnitido
-   useIce: booleano passando `true` será utilizado o stun do freeswitch `stun:stun.freeswitch.org`
-   tag: id da tag audio que será necessaria para reproduzir o audio da chamada

**Exemplo Objeto Final:**

```js
{
    agent: { login: "luan", passwd: "12345" },
    wssAddress: "luanyata.com:8082",
    wsFallbackURL: ["luan.com:8082","yata.com:8082"],
    useIce: true,
    tag: "call"
};
```

### **Actions**:

Contem todas as ações que podem ser feitas na chamada:

```javascript
import { Actions } from 'verto-gateway'
```

**Call:**

Para realizar uma chamada basta chamar a função `call()` parando dois parametro:

-   Número origin
-   Número destino

```js
Actions.call('8888', '9999')
```

**Answer:**

Para atender a chamada basta chamar a função `answer()`.

```js
Actions.answer()
```

**Hangup:**

Para desligar a chamada basta chamar a função `hangup()`.

```js
Actions.hangup()
```

## License

MIT
