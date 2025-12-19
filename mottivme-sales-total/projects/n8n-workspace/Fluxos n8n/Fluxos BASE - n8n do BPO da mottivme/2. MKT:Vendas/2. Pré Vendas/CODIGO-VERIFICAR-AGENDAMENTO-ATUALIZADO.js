// ===================================================================
// CODIGO ATUALIZADO PARA O NODE "Verificar Agendamento"
// No workflow "Follow Up Eterno"
// ===================================================================
// Este codigo verifica se o lead tem agendamento E se tem TAG de reagendar
// Se tem TAG reagendar, permite o follow-up mesmo com agendamento passado
// ===================================================================

// Verificar se lead tem appointment agendado
const appointments = $('Buscar Appointments do Contato1').first().json.events || [];
const historico = $('Mensagem anteriores1').all() || [];
const leadData = $('Buscar Lead GHL1').first().json.contact || {};

const now = new Date();

// ===================================================================
// VERIFICACAO DE TAGS
// ===================================================================
const leadTags = leadData.tags || [];
const tagsLowerCase = leadTags.map(tag => tag.toLowerCase());

// Verificar se tem tag de reagendamento
const temTagReagendar = tagsLowerCase.some(tag =>
  tag.includes('reagendar') ||
  tag.includes('noshow') ||
  tag.includes('no-show') ||
  tag.includes('no_show') ||
  tag.includes('nao_compareceu') ||
  tag.includes('naocompareceu')
);

// Verificar se tem tag de IA desativada
const temTagIaDesativada = tagsLowerCase.some(tag =>
  tag.includes('desativar_ia') ||
  tag.includes('ia_desativada') ||
  tag.includes('sem_ia') ||
  tag.includes('humano')
);

// ===================================================================
// VERIFICACAO DE APPOINTMENTS
// ===================================================================

// Verificar appointments futuros
const hasUpcomingAppointment = appointments.some(apt => {
  const aptDate = new Date(apt.startTime);
  return aptDate > now;
});

// Verificar appointments recentes (ultimas 24h) - possivel no-show
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const hasRecentAppointment = appointments.some(apt => {
  const aptDate = new Date(apt.startTime);
  return aptDate > oneDayAgo && aptDate <= now;
});

// Verificar se teve no-show (appointment passou e lead nao respondeu)
const hadNoShow = appointments.some(apt => {
  const aptDate = new Date(apt.startTime);
  const isPast = aptDate <= now;
  const status = (apt.status || '').toLowerCase();
  // Consideramos no-show se passou e status nao e 'showed' ou 'completed'
  return isPast && !['showed', 'completed', 'confirmed'].includes(status);
});

// ===================================================================
// VERIFICACAO NO HISTORICO
// ===================================================================
const historicoTexto = historico.map(h => (h.json.message?.content || '').toLowerCase()).join(' ');

const jaAgendouPorHistorico =
  historicoTexto.includes('agendad') ||
  historicoTexto.includes('confirmad') ||
  historicoTexto.includes('zoom.us') ||
  historicoTexto.includes('meet.google') ||
  historicoTexto.includes('reuniao marcada') ||
  historicoTexto.includes('ate la');

// ===================================================================
// LOGICA DE DECISAO
// ===================================================================

let deveBloquear = false;
let motivo = 'ok';

// Se tem tag de IA desativada, sempre bloquear
if (temTagIaDesativada) {
  deveBloquear = true;
  motivo = 'ia_desativada_tag';
}
// Se tem tag reagendar, PERMITIR follow-up (mesmo com appointment passado)
else if (temTagReagendar) {
  deveBloquear = false;
  motivo = 'ok_reagendamento';
}
// Se tem appointment futuro, bloquear (lead ja tem reuniao marcada)
else if (hasUpcomingAppointment) {
  deveBloquear = true;
  motivo = 'appointment_futuro';
}
// Se teve appointment recente (possivel no-show), verificar se deve abordar
else if (hasRecentAppointment && hadNoShow) {
  // Teve no-show recente - deveria ter tag reagendar
  // Se nao tem, sugerir adicionar a tag
  deveBloquear = false;
  motivo = 'possivel_noshow_sem_tag';
}
else if (hasRecentAppointment) {
  deveBloquear = true;
  motivo = 'appointment_recente';
}
// Se ja agendou pelo historico, bloquear
else if (jaAgendouPorHistorico) {
  deveBloquear = true;
  motivo = 'agendamento_historico';
}

// ===================================================================
// RETORNO
// ===================================================================
return [
  {
    json: {
      ...$input.first().json,
      deve_enviar_followup: !deveBloquear,
      motivo_bloqueio: motivo,
      appointments_count: appointments.length,
      has_upcoming: hasUpcomingAppointment,
      has_recent: hasRecentAppointment,
      had_noshow: hadNoShow,
      tem_tag_reagendar: temTagReagendar,
      tem_tag_ia_desativada: temTagIaDesativada,
      lead_tags: leadTags
    },
    pairedItem: { item: 0 }
  }
];
