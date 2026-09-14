# Guion para la reunión con soporte — en portugués, listo para leer

**Cómo usar este archivo**: es la versión hablada de [[21-preguntas-para-soporte-rmsystemm]] (ahí está el "por qué importa" de cada una, para vos). Acá está solo lo que se dice, en portugués, en orden. Las líneas en *cursiva y en español* son notas tuyas — **no se leen**.

*Revisado el 2026-09-14 contra los archivos que salieron de los videos de la empresa ([[09-copiloto-ia-partner]], [[10-ds-agente-ds-voice-manual]], [[12-caso-real-rafael-prompt-produccion]]) para sacar lo que esos videos ya respondían y agregar lo que ahí quedó marcado como pendiente de confirmar. Si se edita este archivo, revisar también el 21 para que no se desincronicen.*

*Grabá la reunión desde el principio y avisale que estás grabando. Después pasame la transcripción y vuelco todo a los archivos.*

*Si el tiempo se corta, las que no podés dejar pasar son la 1, 2, 3 y 4.*

---

## Abertura

Oi, tudo bem? Antes de começar, tudo bem pra vocês se eu gravar a reunião? É só pra eu não perder nada e poder repassar depois com a equipe.

Pra dar um contexto rápido: a gente é a Fitness Suplementos, vende suplemento por WhatsApp, recebe mais ou menos 5 mil contatos por mês. A gente está montando um agente de IA de vendas dentro da plataforma — o prompt já está configurado, já integramos com o Bling pra puxar produto e estoque, e já montamos alguns fluxos de automação. Só que a gente travou em algumas coisas e tem várias dúvidas de como escalar isso direito. Preparei uma lista, se puder ir respondendo eu vou anotando.

---

## Bloco 1 — Coisas que travam o que a gente já construiu

**1.** Sobre a ação **"Salvar Variável"** do agente: essas variáveis ficam salvas no contato pra sempre, ou elas se perdem quando o atendimento é encerrado?

Pergunto porque a gente montou um fluxo de recompra que depende de ler qual foi o último produto que a pessoa comprou 30, 60 ou 90 dias depois. Se a variável some quando fecha o ticket, esse desenho inteiro não funciona e a gente precisa refazer usando campo personalizado de contato.

*→ Si dice que sí persisten, preguntá esto:*

E tem como eu ver essas variáveis salvas de um contato específico em algum lugar da interface? A gente procurou na ficha do contato e não achou onde aparecem.

**2.** A gente configurou **guardrails** no agente e eles não estão salvando.

O caminho que a gente fez foi: configurar o guardrail de "Ancoragem de valores", clicar em Salvar dentro do modal, depois clicar em "Guardar cambios" no topo da página — que fica habilitado, então parece que salvou —, e aí recarregar a página. Quando recarrega, volta a aparecer "Nenhum guardrail configurado". Isso aconteceu duas vezes, em dias diferentes, no agente de id 9816.

É um bug conhecido? Tem alguma sequência de salvamento diferente que a gente deveria estar fazendo, ou depende de algum plano ou módulo estar habilitado?

Uma coisa que pode estar relacionada: de vez em quando aparece um aviso de **"Conexão ao vivo perdida"** no editor do agente. Pode ser que quando isso acontece o salvamento não chegue no servidor e a gente nem perceba?

*→ Es importante: hoy es la única protección automática contra que invente precios.*

**3.** Existe uma **API do rmsystemm**? A gente viu uma seção de "API Keys" nas configurações, mas não sabe o alcance dela.

Especificamente: dá pra ler as conversas e mensagens? Criar ou atualizar contatos e os campos personalizados deles? Disparar um fluxo de automação de fora?

E o mais importante pra gente: **existem webhooks de saída**? Tipo, quando entra uma mensagem nova ou quando um negócio muda de etapa, a plataforma consegue avisar um sistema externo? Tem documentação disso em algum lugar?

**4.** Se a gente **vincular um canal de WhatsApp** ao agente, ele passa a responder tudo na hora?

A gente não quer soltar isso pros 5 mil contatos de uma vez sem ter testado em real. As Regras de Ativação permitem limitar — por exemplo, só contatos com uma certa etiqueta, ou de uma fila específica? Tem alguma forma de ele atender só uma parte das conversas, pra gente ir liberando aos poucos?

---

## Bloco 2 — Copiloto de IA

**5.** Eu vi um vídeo de vocês, acho que era uma apresentação pros parceiros, falando do **Copiloto de IA** — aquele assistente pra equipe interna, que é diferente do agente que atende o cliente.

Duas funções me chamaram muita atenção: o resumo da conversa com resposta sugerida pro vendedor, e principalmente a parte onde **o Copiloto ajuda a criar e melhorar o prompt do agente**, rodando teste em loop, simulando conversas e ajustando sozinho. Isso é exatamente o trabalho que a gente está fazendo na mão hoje.

*→ No preguntes "¿está disponible?". Ya lo sabemos: en Mi Plan dice "Copiloto IA: não incluído". Es un addon que no tenemos contratado. Andá directo al precio.*

Eu já vi em "Meu Plano" que aparece como *"Copiloto IA: não incluído"*, então entendo que é um addon. **Quanto custa e o que vem incluído?**

**6.** E essa é a que mais me preocupa: no vídeo falava que **o Copiloto não funciona com BYOK**, que precisa da IA Gerenciada. A gente hoje está com chave própria da OpenAI configurada no agente.

*→ Acá tenés una cita literal de la propia plataforma que dice lo contrario. Leela tal cual, es la carta más fuerte de este bloque.*

Só que tem uma coisa que não bate, e queria entender. No **Hub de Integrações**, quando eu clico no conector **"OpenAI Key"**, a descrição de vocês diz, palavra por palavra: *"Conecta tu clave de OpenAI para usar los modelos GPT... en los Agentes de IA, **el Copiloto** y los Flujos de automatización."*

Ou seja, a própria tela diz que a chave própria serve pro Copiloto. Qual das duas está certa?

Então: pra usar o Copiloto a gente teria que migrar a conta inteira pra IA Gerenciada? Dá pra ter **o agente com chave própria e o Copiloto na gerenciada ao mesmo tempo**, ou é tudo ou nada?

E se tiver que migrar: como muda o custo? Hoje a gente paga a OpenAI direto e enxerga o gasto real. Na gerenciada a gente passaria a comprar crédito de vocês, certo? Como funciona esse preço?

**7.** Sobre preço: no material da plataforma base eu vi planos do Copiloto na faixa de R$79, R$247 e R$647 por mês dependendo da quantidade de usuários, mais consumo de créditos de IA à parte.

**Vocês revendem com esses mesmos valores, ou o preço de vocês é outro?** E os créditos de IA entram junto ou são cobrados separado?

---

## Bloco 3 — Base de conhecimento e catálogo de produtos

**8.** Na aba **Conhecimento**, se a gente vincular várias bases de conhecimento, o agente escolhe qual consultar dependendo do contexto, ou ele sempre busca em todas?

Pergunto porque a gente vai subir o catálogo de produtos e queria saber se vale a pena separar por categoria — creatina, proteína, termogênico — em bases diferentes, ou se é melhor deixar tudo numa só.

**9.** Nas **Fontes de conhecimento externas**, quando a gente linka uma planilha do Google Sheets: de quanto em quanto tempo ela atualiza? Se eu mudo um preço na planilha, o agente enxerga na hora ou precisa reindexar?

Tem limite de linhas? E dá pra forçar uma sincronização manual?

**10.** E a **opção de HTTP** nas Fontes de conhecimento externas, como funciona exatamente?

Dá pra passar algum dado da conversa como parâmetro — tipo o nome do produto que o cliente acabou de mencionar? Aceita header de autenticação, tipo Bearer token? Qual é o timeout?

E se o endpoint falhar ou demorar demais, o que o agente faz: avisa o cliente, trava, ou responde mesmo sem o dado?

**11.** A **similaridade mínima de busca**, que aqui está em 0.5 — ela é global do agente ou dá pra configurar por base de conhecimento? A própria tela recomenda 0.35 pra dado estruturado e 0.5 pra texto corrido, e a gente vai ter os dois tipos ao mesmo tempo.

---

## Bloco 4 — Capacidades que a gente quer usar

**12.** Sobre **transcrição de áudio**. Eu vi em "Meu Plano" que aparece como addon não incluído: *"Transcrição de áudios: não incluída"*. Nossos clientes mandam áudio o tempo todo, então isso é importante pra gente.

*→ No preguntes "¿existe?". Ya sabemos que existe como addon y que no lo tenemos.*

**Quanto custa esse addon e o que ele inclui exatamente?** O agente passa a entender o áudio sozinho e responder, ou só gera a transcrição pra equipe ler?

**13.** Sobre o **DS Voice**. Eu já vi o material de vocês explicando os Criativos, os Funis e os Gatilhos, então já entendi que **o Gatilho dispara por correspondência de texto literal, sem passar pela IA**. Minha dúvida é outra:

Primeiro: **a gente tem o módulo DS Voice habilitado na nossa conta?** No editor do agente aparece o botão de ação "Enviar funil de Criativos", mas a gente não achou a seção de Criativos/Funis/Gatilhos em lugar nenhum do menu.

Segundo, e essa é a principal: quando **o próprio agente** chama a ação "Enviar funil de Criativos" — não o Gatilho, o agente mesmo — **ele consegue escolher qual funil mandar pelo critério dele**, dependendo do que está sendo conversado?

O plano é o seguinte: nosso call center vai gravar áudios explicando cada produto e cada situação. A ideia é que se o cliente comenta que tem uma intolerância, por exemplo, o agente escolha e mande o áudio daquele produto específico — sem a gente ter que amarrar isso a uma palavra-chave fixa. Isso é possível hoje?

**14.** Ainda sobre isso, duas coisas do material de vocês que eu queria confirmar se existem aqui na nossa conta:

A opção **"Enviar como gravado na hora"** nos áudios, que faz aparecer o "gravando áudio..." no WhatsApp do cliente — pra parecer que é uma pessoa gravando de verdade naquele momento. Isso a gente tem?

E a variável **"Saudação"**, que preenche sozinha "Bom dia", "Boa tarde" ou "Boa noite" conforme a hora do envio.

*→ (La pregunta 15 sobre "Exceção: Troca de Mensagens" SE ELIMINÓ el 2026-09-14: ya la respondimos solos. Existe, se llama así, y la estamos usando en 5 automatizaciones FV| con ventana de 2 horas. No la preguntes.)*

**16.** No editor do agente, existem os campos de **Temperatura, Delay de resposta e Máximo de tokens**? A gente viu esses parâmetros num exemplo de agente de vocês (120 tokens, 120 segundos de delay) e queria confirmar se estão disponíveis na nossa conta e onde ficam.

**17.** A ação **"Agendamento de mensagem"**: o agente consegue programar uma mensagem pra uma data que ele deduziu da conversa?

O caso real é o cliente falar "só recebo dia 3", e a gente querer que o agente agende o follow-up sozinho pro dia 4 ou 5 — com uma folguinha, pra não parecer desesperado pra vender. A data pode sair de uma variável ou do raciocínio dele, ou tem que ser um tempo fixo definido antes?

**18.** Quando alguém da nossa equipe **responde manualmente** numa conversa que o agente está atendendo, o agente para sozinho? A gente não quer que o cliente receba duas respostas em cima da outra.

E o que exatamente faz o toggle "Desativar agente ao responder fora da plataforma"? E o "Responder tickets com responsável"?

**19.** Sobre o **Follow Up Generativo**: eu vi que ele tem um campo próprio de "Instruções para o Follow-Up", separado do prompt principal do agente. Minha dúvida é o que ele herda do agente e o que não:

Ele respeita os guardrails configurados no agente? Consegue ler as variáveis salvas do contato? E consegue executar as mesmas ações — tipo transferir pro humano — ou só escreve texto?

A gente quer usar ele pra reativar cliente na recompra, e precisa que mantenha as mesmas regras de não inventar preço e transferir quando não souber.

**20.** Sobre os dados de **anúncio do Meta**. Eu já vi que vocês guardam isso: nos cards do pipeline aparecem a campanha, o conjunto e o anúncio — tipo "NUEVO STOCK 12/08 [MENSAJES]", "P. Segm Intereses (Mensajes WP)" e "HIPERCALORICO VITAMIN HORSE 3KG [VIDEO]". Isso é ótimo.

*→ Ojo: NO preguntes si lo captura. Ya sabemos que sí. La pregunta es cómo leerlo.*

Minha dúvida é outra: **como o agente acessa esse dado?** Na ficha do negócio eu só vejo Telefone, Endereço e os campos personalizados que a gente criou — a campanha e o anúncio não aparecem ali.

Tem uma variável pra ler isso dentro do prompt do agente? Dá pra usar como condição nas Regras de Ativação ou dentro de um fluxo de automação?

*→ Y aprovechá para preguntar esto:*

Aproveitando: no Hub de Integrações o **Meta Ads** aparece como "Reconexão necessária". O que a gente perde enquanto está assim, e como faz pra reconectar?

**21.** Dá pra **exportar o histórico de conversas em lote**? A ideia é revisar de tempos em tempos o que o agente respondeu, pra ir melhorando o prompt com casos reais em vez de ficar abrindo conversa por conversa.

---

## Bloco 3B — A pergunta más importante de todas (agregada 2026-09-14)

*Esta salió de probar el agente por primera vez. Es la que más vale de toda la reunión: si no se resuelve, no podemos validar nada. Si el tiempo se corta, hacé esta antes que ninguna otra del bloque 3.*

**19b.** A gente anexou o conector do Google Sheets no agente e também carregou a planilha como fonte de conhecimento. Depois fui na aba **Testar** e perguntei o preço de um produto que está na planilha.

**O agente inventou o preço.** Disse "1.200 pesos" quando na planilha está 990. Pedi explicitamente pra ele buscar a linha na planilha e ele respondeu "vou confirmar e te conto". Perguntei qual era o produto mais vendido e inventou outro que nem é o primeiro da lista.

Reparei também que a aba **"Uso"** continuou marcando **0 tokens e 0 requisições** mesmo depois de umas 7 respostas.

Então minha pergunta é: **a aba "Testar" executa os conectores e consulta as fontes de conhecimento, ou ela só testa o prompt contra o modelo?**

Pergunto porque, se ela não executa as ferramentas, a gente não tem como validar nada antes de colocar no ar — e colocar um agente que inventa preço na frente do cliente não é uma opção.

E se ela não executa: **qual é a forma certa de testar um agente com conector antes de ligar num canal real?**

*→ Si dice que la pestaña Testar sí ejecuta las herramientas, entonces el problema es otro y hay que preguntar:*

Se ela executa, então por que ele não chamou o conector nenhuma vez? Tem algum log onde eu veja as chamadas de ferramenta que o agente fez ou tentou fazer?

---

## Bloco 4B — Hub de Integrações

*Bloque nuevo (2026-09-14), después de abrir los 25 conectores uno por uno. Ver [[23-conectores-hub-integraciones]]. La más importante de todas es la de Shopify.*

**21a.** Fui olhar o **Hub de Integrações** e vi que tem 25 conectores, cada um com uma lista enorme de ações. Mas o agente aqui diz *"Nenhum conector anexado"*. Queria confirmar se entendi o caminho certo: eu conecto a conta no Hub, depois anexo ela no agente em **Ferramentas → Conectores**, e aí escrevo no prompt em linguagem natural quando usar. É isso, ou falta algum passo?

**21b.** A mais importante pra gente: o conector do **Shopify**. A descrição fala em sincronizar produtos, pedidos e clientes, e em **disparar fluxos por eventos da loja, tipo "novo pedido" e "carrinho abandonado"**.

Isso resolveria vários problemas nossos de uma vez, então queria entender direito:

- O que exatamente sincroniza pro CRM? Produto com preço, descrição e link? Com que frequência atualiza?
- Esses eventos de loja aparecem como **gatilho dentro dos Fluxos de Automação**? Porque carrinho abandonado seria perfeito pro nosso funil de remarketing.
- O agente consegue consultar o **status de um pedido** direto na conversa?

**21c.** Sobre o conector do **Google Sheets** — a gente acabou de conectar. Ele tem uma ação chamada **"Buscar linha da planilha"**, que busca por correspondência exata.

A gente quer botar o catálogo inteiro numa planilha. Minha dúvida é qual é o caminho certo: subir a planilha como **base de conhecimento** na aba Conhecimento, ou anexar o **conector** e deixar o agente consultar na hora?

Pergunto porque pra preço a busca por similaridade me assusta — se ela trouxer a linha errada, o agente informa um preço errado pro cliente. A busca exata não teria esse risco. Dá pra usar os dois juntos?

**21d.** Ainda no Sheets: ele tem **8 gatilhos** listados, tipo "Novas Linhas" e "Valores do Intervalo Alterados". Esses gatilhos aparecem onde? Dá pra usar eles pra **iniciar um Fluxo de Automação**?

*→ Esto es lo que destrabaría la alerta de stock sin depender de Bling.*

**21e.** Duas coisas menores que não consegui entender sozinho:

- Em cima da lista tem os filtros **"Todos", "Agente IA" e "Fluxo"**. O filtro "Agente IA" esconde o Google Sheets — mas quando eu vou anexar conector no agente, o Google Sheets aparece na lista. O que esse filtro quer dizer?
- Algumas ações têm uma etiqueta **"AUTOMAÇÃO"** e a maioria não tem. São só 12 de mais de 200. O que muda entre uma ação com essa etiqueta e uma sem?

---

## Bloco 5 — Custos e limites

**22.** No **Modo Avançado** de processamento de ações, aquele cache de prompt de 90% que a tela menciona: é automático? Nosso prompt é grande, uns 11 mil caracteres, e ele vai junto em toda mensagem.

**23.** A aba **"Uso"** mostra o custo real em dólar, ou só a quantidade de mensagens? A gente precisa conseguir projetar quanto vai custar quando escalar pra todo o volume.

**24.** Tem **limite de conversas simultâneas** que o agente aguenta? Em pico de campanha entram muitos leads ao mesmo tempo.

**25.** E quantos **agentes de IA diferentes** dá pra ter na conta? Eles dividem custo e limite, ou cada um conta separado?

---

## Bloco 6 — Um detalhe pra reportar

**26.** Fluxo com gatilho **"Agendado" não tem "Executar agora"** — só tem o "Testar", que simula e não executa as requisições HTTP de verdade, ele mesmo avisa "não executada no teste".

Tem alguma forma de forçar uma execução real pra testar, sem ter que esperar o horário chegar? A gente perdeu várias horas esperando só pra descobrir que tinha um erro numa requisição.

---

## Fechamento

**27.** Por último: vocês têm um **canal direto pra reportar bug**? E existe algum **changelog ou roadmap** que a gente possa acompanhar pra saber o que vem por aí?

Era isso. Muito obrigado pelo tempo — vou repassar tudo com a equipe e provavelmente volto com mais dúvidas conforme a gente for avançando.
