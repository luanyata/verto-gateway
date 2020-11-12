# Verto-gateway

Biblioteca simplificada de comunicação (chamada de audio, audioconferência, videochamada, videoconferência e troca de mensagem de texto) via browser utilizando Websocket e SIP.

## Pré-requisito

- Servidor [Freeswitch](https://freeswitch.org/confluence/display/FREESWITCH/Introduction) configurado com o [mod_verto](https://freeswitch.org/confluence/display/FREESWITCH/mod_verto) habilitado.

_ps.: No momemto apenas chamada de audio está implementada._

- [Instalação](#instalação)
  - [NPM](#npm)
  - [Yarn](#yarn)
  - [Carregando Dependências](#carregar-denpendências)
- [API](#api)
  - [Tag Audio](#tags-audio)
- [Config](#config)
  - [Start](#start)
- [Actions](#actions)
  - [Call](#call)
  - [Answer](#answer)
  - [Mute](#mute)
  - [Unmute](#unmute)
  - [Hold](#hold)
  - [Unhold](#unhold)
  - [DTMF](#dtmf)
  - [Hangup](#hangup)
  - [Logout](#logout)
  - [Auto Atendimento](#auto-atendimento)
- [Eventos](#eventos)
  - [Estados do Ramal](#estados-do-ramal)
  - [Estados da Chamada](#estados-da-chamada)
  - [Bina](#bina)
- [Licença](#licença)

## Instalação:

O projeto ainda se encontro em processo de desenvolvimento por isso ainda não publicado no NPM. Para usar você deverá puxar a lib do github. Para isso basta adicionar a linha abaixo no seu `package.json`:

```json
"verto-gateway": "git+https://github.com/luanyata/verto-gateway.git"
```

Em seguida realize a instalação do mesmo com seu gerenciar de pacotes:

### **NPM**:

```shell
npm install
```

ou

### **YARN**:

```shell
yarn install
```

### **Carregar Dependências**:

Agora carregue os javascripts no seu HTML antes dos seus javascript:

```html
<script src="../node_modules/verto/src/vendor/adapter-latest.js"></script>
<script src="../node_modules/verto/src/vendor/media-device-id.min.js"></script>
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../node_modules/jquery-json/dist/jquery.json.min.js"></script>
<script src="../node_modules/verto/src/jquery.verto.js"></script>
<script src="../node_modules/verto/src/jquery.FSRTC.js"></script>
<script src="../node_modules/verto/src/jquery.jsonrpcclient.js"></script>
```

## API:

### **Tags Audio:**

Para que o audio das chamadas sejam executada, é necessario a criação da `tag audio` seguindo algumas recomendações:

- Deve conter um ID que será utilizado na configuração para reporduzir o audio da chamada
- Deve ter a propriedade autoplay
- Opcionalmente ter a propriedade hidden para que o play de audio não seja exibido na tela

```html
<audio id="call" hidden autoplay></audio>
```

Para que o ramal que recebe a chamada sinalize que está tocando deve ser criada uma `tag audio` seguindo algumas recomendações:

- Obrigatoriamente deve conter o ID `ring`
- Opcionalmente ter a propriedade hidden para que o play de audio não seja exibido na tela
- `src` deve conter o audio a ser reproduzido

```html
<audio id="ring" hidden src="../sound/ring.mp3"></audio>
```

### **Config**:

#### **Start:**

Resposavel por registrar o ramal

```javascript
import { Config } from 'verto-gateway';

Config.start('parametro');
```

**Parametros**:

- agent
  - login: usuário do ramal
  - passwd: senha do ramal
- wssAddress: endereço do servidor wss
- wsFallbackURL: array de string contendo os endereços de outros servidores wss para ser acionados em casos de falha. Caso nao tenha o valor pode ser omnitido
- useIce: booleano passando `true` será utilizado o stun do freeswitch `stun:stun.freeswitch.org`
- tag: id da tag audio que será necessaria para reproduzir o audio da chamada

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
import { Actions } from 'verto-gateway';
```

#### **Call:**

Para realizar uma chamada basta chamar a função `call()` parando dois parametro:

- Número origin
- Número destino

```js
Actions.call('8888', '9999');
```

#### **Answer:**

Para atender a chamada basta chamar a função `answer()`:

```js
Actions.answer();
```

#### **Mute:**

Para por seu microfone no mudo basta chamar a função `mute()`:

```js
Actions.mute();
```

#### **Unmute:**

Para retirar seu microfone do mute basta chamar a função `unmute()`:

```js
Actions.unmute();
```

#### **Hold:**

Para por a chamada em espera basta chamar a função `hold()`:

```js
Actions.hold();
```

#### **Unhold:**

Para remover a chamada da espera basta chamar a função `unhold()`:

```js
Actions.unhold();
```

#### **DTMF:**

Para enviar eventos dtmf basta chamar a função `dtmf()` passando um parametro:

- Valor a ser passado via DTMF

```js
Actions.dtmf('valorDTMF');
```

#### **Hangup:**

Para desligar a chamada basta chamar a função `hangup()`:

```js
Actions.hangup();
```

#### **Logout:**

Para desregistrar o ramal basta chamar a função `logout()`. Com isso o a conexão com o socket será finalizada:

```js
Actions.logout();
```

### **Auto Atendimento:**

Para poder utilizar a função de auto atendimento basta adicionar adicionar a chave `autoAnswer` com o valor `true` no `localStorage`.

### **Eventos:**

Algumas informações que trafegam pelo websocket se dará acesso através de eventos, sendo eles:

- O estado atual do ramal
- Número do telefone de quem está ligando
- Estado da chamada

#### **Estados do Ramal**:

Você receberá o estado do ramal através do emissor de evento `handleWsState` com a classificação `wsState`.

```javascript
import { Events } from 'verto-gateway'

Events.handleWsState.on('wsState', state => {...} )
```

Existem tipos de 2 estados:

- Registrar o Ramal: Indica se o ramal efetuou ou não o registro com sucesso
  - retorna as strings `logged` ou `failed-login` respectivamente.
- Desregistar o ramal:
  - retorna a string `close` quando o ramal realizar o logout no Freeswitch.

#### **Estados da Chamada**

Em uma chamada existem dois tipos de eventos Inbound e Outbound. Em cada um dos estados do tipo da chamada uma serie de eventos são disparados utilizando o emissor `Events.handleCallState`.

```javascript
import { Events } from 'verto-gateway'

Events.handleCallState.on('EVENTO_ID', phoneNumber => {...} )
```

#### **Chamada Entrante - Inbound:**

- **Estado Ring**:

  - Evento ID `BINA`:

  ```text
  - Envia o número de quem está ligando.
  - Tipo: String
  ```

  - Evento ID `RECEIVE_CALL`:

  ```text
  - Envia o objeto verto contendo a conversa.
  - Tipo: Object
  ```

- **Estado Answering**:

  - Evento ID `ANSWERING`

  ```text
  - Informando que o ramal está enviando a resposta para estabelecer a comunicação.
  - Tipo: Boolean
  - Valor: true
  ```

- **Estado Active**:

  - Evento ID `INBOUND_ACTIVE`:

  ```text
  - Informa que a comunicação foi estabelecida entre aos ramais e está em conversação.
  - Tipo: Boolean
  - Valor: true
  ```

- **Estado Hangup**:

  - Evento ID `INBOUND_HANGUP_CAUSE`:

  ```text
  - Informa o motivo do desligamento da chamada.
  - Tipo: String
  ```

  _ps.: Todos os motivos dos possiveis desligamentos podem ser obtidos na [documentação do Freeswitch](https://freeswitch.org/confluence/display/FREESWITCH/Hangup+Cause+Code+Table)_

- **Estado Destroy**

  - Evento ID `INBOUND_ACTIVE`:

  ```text
  - Informando que a chamada foi desligada.
  - Tipo: Boolean
  - Valor: false
  ```

  - Evento ID `ANSWERING`:

  ```text
  - Reinicia o estado da solicitação da comunicação.
  - Tipo: Boolean
  - Valor: false
  ```

#### **Chamada Sainte - Outbound:**

- **Estado Trying**

  - Evento ID `TRYNG`:

  ```text
  - Informa que está tentando/chamando o número destino
  - Tipo: Boolean
  - Valor: true
  ```

- **Estado Active**

  - Evento ID `OUTBOUND_ACTIVE`:

  ```text
  - Informa que a comunicação foi estabelecida entre aos ramais e está em conversação.
  - Tipo: Boolean
  - Valor: true
  ```

- **Estado Hangup**:

  - Evento ID `OUTBOUND_HANGUP_CAUSE`:

  ```text
  - Informa o motivo do desligamento da chamada.
  - Tipo: String
  ```

  _ps.: Todos os motivos dos possiveis desligamentos podem ser obtidos na [documentação do Freeswitch](https://freeswitch.org/confluence/display/FREESWITCH/Hangup+Cause+Code+Table)_

* **Estado Destroy**

  - Evento ID `INBOUND_ACTIVE`:

  ```text
  - Informa que os ramais não estão mais ativos para a chamada que estava acontecendo.
  - Tipo: Boolean
  - Valor: false
  ```

## Licença

[MIT License](LICENSE)

Copyright (c) 2020 Luan Lima
