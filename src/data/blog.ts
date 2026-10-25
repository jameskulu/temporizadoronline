export interface BlogArticle {
	slug: string;
	title: string;
	description: string;
	category: string;
	readingTime: number;
	introduction: string;
	sections: Array<{
		heading: string;
		paragraphs: string[];
		list?: string[];
	}>;
	relatedTools: Array<{ path: string; label: string }>;
}

export const blogArticles: BlogArticle[] = [
	{
		slug: 'como-usar-pomodoro-na-pratica',
		title: 'Como usar o método Pomodoro na prática: um guia flexível',
		description:
			'Aprenda a organizar uma sessão Pomodoro, escolher durações realistas e adaptar os ciclos de foco e pausa à tarefa.',
		category: 'Organização do tempo',
		readingTime: 5,
		introduction:
			'O método Pomodoro organiza o trabalho em períodos de foco separados por pausas. A ideia é simples: decidir o que cabe no próximo bloco, reduzir interrupções e fazer uma pausa planejada. Não existe uma duração perfeita para todo mundo; use o formato como ponto de partida e ajuste conforme a tarefa e a sua rotina.',
		sections: [
			{
				heading: 'Prepare uma tarefa que caiba em um bloco',
				paragraphs: [
					'Antes de iniciar, transforme uma intenção ampla em uma ação observável. “Estudar matemática” pode virar “resolver os exercícios 1 a 4” ou “revisar as anotações da aula”. Uma tarefa delimitada ajuda a perceber o que foi feito quando o alarme tocar.',
					'Se a tarefa for grande, anote o próximo passo em vez de tentar estimar todo o projeto. Reserve alguns minutos para separar materiais, fechar abas sem relação e decidir o que pode esperar até a pausa.',
				],
			},
			{
				heading: 'Configure o ciclo sem tratar o padrão como regra',
				paragraphs: [
					'Um ciclo conhecido usa 25 minutos de foco e 5 de pausa, mas a ferramenta permite ajustar os tempos. Para começar, escolha um bloco que pareça viável para a atividade. Uma leitura densa, uma tarefa administrativa e uma revisão podem pedir ritmos diferentes.',
					'Na página de Pomodoro, confira as durações de foco e descanso antes de iniciar. O temporizador mostra a fase atual e pode passar de foco para pausa automaticamente. Se preferir uma única contagem sem transição de fases, use o temporizador simples.',
				],
			},
			{
				heading: 'Durante o foco, registre as interrupções',
				paragraphs: [
					'Se surgir uma ideia ou uma tarefa urgente, anote-a em um papel ou arquivo e volte ao que estava fazendo quando for possível. Isso evita depender da memória e ajuda a não abandonar o bloco por uma interrupção pequena.',
					'Nem toda interrupção pode ser adiada. Se precisar parar, pause ou reinicie o ciclo de acordo com o que fizer sentido. O objetivo é organizar o trabalho, não cumprir uma sequência à custa das suas responsabilidades.',
				],
			},
			{
				heading: 'Use a pausa para encerrar uma etapa',
				paragraphs: [
					'Quando o foco terminar, registre onde parou e qual será o próximo passo. Na pausa, afaste-se da tarefa por alguns minutos; ao voltar, leia essa anotação para retomar com menos preparação.',
					'Depois de vários ciclos, faça uma pausa mais longa se isso for útil. A quantidade de ciclos e o tamanho dessa pausa podem variar. Não é necessário concluir um ciclo inteiro se a atividade exigir uma interrupção ou se o formato não estiver funcionando para você.',
				],
			},
			{
				heading: 'Faça um ajuste pequeno na próxima sessão',
				paragraphs: [
					'Se você interrompeu o bloco muitas vezes, reduza distrações ou escolha uma tarefa menor. Se terminou cedo, anote o tempo aproximado e escolha um bloco diferente na próxima vez. Uma observação curta sobre o que ajudou já pode orientar o próximo ajuste.',
					'O Pomodoro é uma estrutura de tempo, não uma medida de produtividade nem uma promessa de resultado. Adapte-o à tarefa, às pausas necessárias e ao seu contexto.',
				],
			},
		],
		relatedTools: [
			{ path: '/pomodoro/', label: 'Abrir o temporizador Pomodoro' },
			{ path: '/temporizador-para-estudos/', label: 'Usar um temporizador para estudos' },
		],
	},
	{
		slug: 'como-planejar-uma-sessao-de-estudos',
		title: 'Como planejar uma sessão de estudos em quatro etapas',
		description:
			'Um roteiro prático para definir uma meta de estudo, preparar materiais, dividir o tempo e registrar o próximo passo.',
		category: 'Estudos',
		readingTime: 5,
		introduction:
			'Uma sessão de estudo fica mais fácil de começar quando você sabe qual tarefa vem primeiro. Em vez de preencher todo o período com uma lista extensa, escolha um objetivo pequeno, separe o material necessário e deixe espaço para conferir o que conseguiu fazer.',
		sections: [
			{
				heading: '1. Transforme o tema em uma tarefa concreta',
				paragraphs: [
					'“Estudar biologia” não indica por onde começar. Reescreva a meta como uma ação: resumir uma seção, responder perguntas de revisão, explicar um conceito com suas próprias palavras ou resolver uma quantidade definida de exercícios.',
					'Se você tem uma prova ou entrega, considere a data e os tópicos pendentes ao escolher a prioridade. Não tente cobrir tudo em uma única sessão; selecione o próximo passo que pode ser iniciado agora.',
				],
			},
			{
				heading: '2. Separe o que vai usar',
				paragraphs: [
					'Deixe à mão o livro, as anotações e os materiais relacionados à tarefa. Feche documentos e abas que não serão necessários e mantenha uma folha para anotar dúvidas ou assuntos que surgirem no meio do bloco.',
					'Se for usar o celular para consultar material, silencie notificações que não sejam necessárias. Se a consulta puder esperar, anote o assunto para verificar depois da sessão.',
				],
			},
			{
				heading: '3. Escolha um bloco e comece',
				paragraphs: [
					'Defina uma duração que combine com o seu tempo disponível e com a tarefa. Você pode começar com 25 minutos e ajustar, ou escolher outro intervalo. O temporizador de estudos abre com 25 minutos, mas é possível alterar a duração antes de iniciar.',
					'Durante o bloco, tente produzir algo que possa conferir: respostas, exercícios resolvidos, um esquema ou uma lista de dúvidas. Uma contagem regressiva simples não muda automaticamente para uma pausa; para ciclos com transições automáticas, use o modo Pomodoro.',
				],
			},
			{
				heading: '4. Feche a sessão com uma nota de continuidade',
				paragraphs: [
					'Ao terminar, anote o que foi concluído e o que ficou pendente. Registre uma ação específica para a próxima sessão, como “rever as questões 3 e 4” em vez de “continuar estudando”. Isso cria um ponto de partida claro.',
					'Este temporizador não salva um histórico de estudo nem registra automaticamente a matéria. Se quiser acompanhar o tempo ao longo dos dias, anote manualmente a data, a tarefa e o tempo aproximado em uma agenda ou planilha.',
				],
			},
			{
				heading: 'Quando vale usar ciclos de foco e pausa?',
				paragraphs: [
					'Uma sessão única é útil quando você quer controlar apenas um período. Se prefere que o relógio alterne entre foco e descanso, configure o Pomodoro. Se precisa apenas cronometrar uma atividade sem definir um limite, o cronômetro é a opção adequada.',
					'Nenhum intervalo funciona para todas as matérias ou rotinas. Ajuste o plano quando houver aulas, necessidades de descanso ou outras obrigações.',
				],
			},
		],
		relatedTools: [
			{ path: '/temporizador-para-estudos/', label: 'Abrir o temporizador para estudos' },
			{ path: '/pomodoro/', label: 'Configurar ciclos Pomodoro' },
			{ path: '/temporizador/15-minutos/', label: 'Abrir um temporizador de 15 minutos' },
		],
	},
	{
		slug: 'como-organizar-o-tempo-na-cozinha',
		title: 'Como organizar o tempo na cozinha com temporizadores',
		description:
			'Aprenda a planejar etapas de preparo, usar contagens separadas e reduzir esquecimentos ao cozinhar.',
		category: 'Cozinha',
		readingTime: 4,
		introduction:
			'Quando várias etapas acontecem ao mesmo tempo, é fácil esquecer uma panela ou perder a noção de quando começar a próxima tarefa. Um temporizador ajuda a marcar momentos específicos do preparo, desde que cada alarme esteja associado a uma etapa clara.',
		sections: [
			{
				heading: 'Leia a receita e organize as etapas',
				paragraphs: [
					'Antes de ligar o forno ou colocar uma panela no fogo, percorra a receita e identifique os tempos de espera. Separe ingredientes e utensílios, e anote quais etapas podem acontecer em paralelo. Isso evita iniciar uma contagem sem saber o que fazer quando ela terminar.',
					'Use o tempo indicado pela receita como referência inicial e acompanhe o alimento visualmente. Equipamentos, quantidades e métodos podem alterar o tempo necessário; um alarme serve para lembrar de conferir, não para confirmar sozinho que o preparo terminou.',
				],
			},
			{
				heading: 'Associe cada contagem a uma tarefa',
				paragraphs: [
					'Se estiver acompanhando uma única etapa, abra a duração correspondente e inicie a contagem. Para várias etapas, você pode abrir temporizadores em abas separadas, se o navegador e o aparelho permitirem. Mantenha nomes ou anotações visíveis para não confundir os alarmes.',
					'Outra opção é usar uma lista escrita com o nome da etapa e o horário em que deve ser conferida. O temporizador simples mostra uma contagem regressiva; ele não organiza várias receitas ou alarmes em uma agenda.',
				],
			},
			{
				heading: 'Planeje o que fazer quando o alarme tocar',
				paragraphs: [
					'Antes de iniciar, decida qual será a próxima ação: mexer, virar, reduzir o fogo, conferir o ponto ou iniciar outra etapa. Se estiver ocupado, pause ou reinicie a contagem após verificar o alimento, em vez de confiar que um novo alarme será criado automaticamente.',
					'Para uma sequência de etapas com avisos, experimente o modo Sequências e confira cada intervalo antes de iniciar. Para uma única duração pronta, há atalhos de minutos e horas na página principal.',
				],
			},
			{
				heading: 'Use o alarme como lembrete, não como único controle',
				paragraphs: [
					'Teste o som antes de cozinhar, ajuste o volume do aparelho e deixe a página acessível. Navegadores podem limitar áudio quando a página fica em segundo plano, o dispositivo é suspenso ou a tela é bloqueada; não conte com a reprodução do alarme nessas situações.',
					'Um temporizador não mede temperatura interna, não substitui instruções da receita e não determina por si só se um alimento está pronto ou seguro. Use os critérios apropriados para o alimento e o método de preparo.',
				],
			},
		],
		relatedTools: [
			{ path: '/temporizador-para-cozinha/', label: 'Abrir o temporizador para cozinha' },
			{ path: '/sequencias/', label: 'Configurar uma sequência de etapas' },
			{ path: '/', label: 'Usar o temporizador online' },
		],
	},
	{
		slug: 'como-configurar-intervalos-de-trabalho-e-descanso',
		title: 'Como configurar intervalos de trabalho e descanso',
		description:
			'Entenda os elementos de um temporizador intervalado e monte uma sequência simples que você possa acompanhar.',
		category: 'Intervalos',
		readingTime: 5,
		introduction:
			'Um temporizador intervalado alterna períodos de atividade e descanso por um número definido de rodadas. Antes de iniciar, vale decidir o que significa cada fase, quantas rodadas você pretende acompanhar e como o sinal do timer será usado.',
		sections: [
			{
				heading: 'Defina a atividade e o objetivo da sessão',
				paragraphs: [
					'Escolha uma atividade que você já saiba executar e determine o que deseja acompanhar: duração de cada etapa, número de repetições ou apenas o tempo total. Um plano curto e compreensível é mais fácil de seguir do que uma sequência com muitas transições.',
					'Se estiver organizando exercício físico, adapte a atividade e as pausas às suas condições e ao espaço disponível. Esta ferramenta controla intervalos; ela não avalia técnica, intensidade, aptidão ou segurança para uma pessoa específica.',
				],
			},
			{
				heading: 'Configure trabalho, descanso e rodadas',
				paragraphs: [
					'Escolha a duração de trabalho, a duração de descanso e a quantidade de rodadas. Faça uma conferência rápida da configuração antes de começar. Para testar uma sequência nova, experimente um ciclo primeiro e confirme que os avisos são audíveis.',
					'No modo Intervalos, os períodos e o número de rodadas são configuráveis. O Tabata é uma predefinição específica de 20 segundos de trabalho e 10 segundos de descanso por 8 rodadas; ela é apenas uma configuração pronta, não uma recomendação para todas as pessoas ou atividades.',
				],
			},
			{
				heading: 'Use transições que você consiga acompanhar',
				paragraphs: [
					'Quando a fase mudar, confira o rótulo e o número da rodada no mostrador. Se estiver usando um som, teste-o antes e mantenha o aparelho em condições de emitir áudio. O navegador pode suspender a página ou bloquear a reprodução quando o aparelho fica inativo.',
					'Se precisar de mais tempo, pause e ajuste o plano conforme necessário. Não há obrigação de seguir a contagem sem interrupções; o timer é um apoio de organização.',
				],
			},
			{
				heading: 'Revise a sequência ao terminar',
				paragraphs: [
					'Ao final, anote se a duração permitiu concluir as etapas e se as transições foram claras. Na próxima sessão, altere uma variável de cada vez, como a quantidade de rodadas ou a duração do descanso. Assim fica mais fácil identificar qual ajuste tornou a configuração mais prática.',
					'Se uma atividade causar dor, mal-estar ou preocupação, interrompa-a e procure orientação adequada. Para recomendações de exercício individualizadas, converse com um profissional qualificado.',
				],
			},
		],
		relatedTools: [
			{ path: '/intervalos/', label: 'Configurar intervalos personalizados' },
			{ path: '/temporizador-tabata/', label: 'Abrir o preset Tabata 20/10' },
			{ path: '/temporizador-hiit/', label: 'Ver o temporizador HIIT' },
		],
	},
	{
		slug: 'temporizador-cronometro-ou-pomodoro',
		title: 'Temporizador, cronômetro ou Pomodoro: qual escolher?',
		description:
			'Compare contagem regressiva, tempo decorrido, ciclos de foco e intervalos para escolher a ferramenta certa para cada tarefa.',
		category: 'Guias de uso',
		readingTime: 4,
		introduction:
			'Temporizador, cronômetro e Pomodoro medem o tempo de formas diferentes. A escolha depende de você querer chegar a um horário limite, medir quanto tempo passou ou alternar entre fases. Veja como distinguir os modos antes de iniciar.',
		sections: [
			{
				heading: 'Temporizador: comece com um limite definido',
				paragraphs: [
					'Use uma contagem regressiva quando já souber quanto tempo deseja reservar. Ela é útil para marcar uma pausa, acompanhar uma etapa de preparo ou delimitar um bloco de trabalho. Você pode escolher uma duração pronta ou configurar horas, minutos e segundos.',
					'O temporizador começa apenas quando você toca em Iniciar. Ao terminar, o alarme pode tocar conforme o navegador e as configurações do aparelho; a reprodução com a tela bloqueada ou a página suspensa não é garantida.',
				],
			},
			{
				heading: 'Cronômetro: veja quanto tempo já passou',
				paragraphs: [
					'O cronômetro parte de zero e mede o tempo decorrido. Escolha esse modo quando a duração final ainda é desconhecida, como ao medir uma tarefa ou registrar voltas. Os controles de volta guardam marcas do tempo durante a sessão.',
					'Como o cronômetro não tem um limite predefinido, ele não avisa que uma duração planejada terminou como faria uma contagem regressiva.',
				],
			},
			{
				heading: 'Pomodoro: alterne períodos de foco e pausa',
				paragraphs: [
					'O modo Pomodoro combina um período de foco com pausas configuráveis e pode avançar entre as fases automaticamente. Use-o quando quiser acompanhar uma sequência de blocos sem iniciar manualmente uma nova contagem para cada etapa.',
					'Os tempos padrão são pontos de partida, não uma regra universal. Ajuste o ciclo à tarefa e interrompa-o quando a rotina exigir. Se você precisa apenas de uma sessão sem fases automáticas, use o temporizador simples.',
				],
			},
			{
				heading: 'Intervalos: repita fases personalizadas',
				paragraphs: [
					'No modo Intervalos, configure períodos de trabalho e descanso e escolha o número de rodadas. É indicado para sequências repetidas em que as mesmas fases se alternam.',
					'Se o que você precisa é uma lista de etapas com durações diferentes, use Sequências. Uma contagem simples não troca de etapa automaticamente; confira qual ferramenta corresponde ao fluxo que deseja seguir.',
				],
			},
			{
				heading: 'Resumo rápido',
				paragraphs: [
					'Use esta regra prática: duração conhecida pede um temporizador; tempo decorrido pede um cronômetro; foco seguido de pausas pede Pomodoro; intervalos repetidos pedem o modo Intervalos. Para uma rotina em várias etapas, prefira Sequências.',
					'Você pode alternar entre os modos no próprio aplicativo. Antes de começar, confira a duração, o número de rodadas e o som escolhido.',
				],
				list: [
					'Contagem regressiva: o tempo final é conhecido.',
					'Cronômetro: você quer medir o tempo que passou.',
					'Pomodoro: você quer ciclos de foco e pausa.',
					'Intervalos: você quer repetir fases configuráveis.',
				],
			},
		],
		relatedTools: [
			{ path: '/', label: 'Abrir o temporizador online' },
			{ path: '/cronometro/', label: 'Abrir o cronômetro com voltas' },
			{ path: '/pomodoro/', label: 'Abrir o Pomodoro' },
			{ path: '/intervalos/', label: 'Configurar intervalos' },
			{ path: '/sequencias/', label: 'Criar uma sequência de etapas' },
		],
	},
];
