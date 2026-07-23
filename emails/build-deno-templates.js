const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const destFile = path.join(__dirname, '..', 'supabase', 'functions', '_shared', 'templates.ts');

const templates = [
  {
    file: 'bienvenida-abogado.html',
    key: 'bienvenidaAbogado',
    replacements: [
      { search: 'Carlos Pérez', replace: '{{firstName}} {{lastName}}' },
      { search: 'carlos.perez@ejemplo.cl', replace: '{{email}}' },
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Pérez', replace: '{{lastName}}' },
    ]
  },
  {
    file: 'aprobacion-abogado.html',
    key: 'aprobacionAbogado',
    replacements: [
      { search: 'Carlos Pérez', replace: '{{firstName}} {{lastName}}' },
      { search: 'carlos.perez@ejemplo.cl', replace: '{{email}}' },
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Pérez', replace: '{{lastName}}' },
    ]
  },
  {
    file: 'rechazo-abogado.html',
    key: 'rechazoAbogado',
    replacements: [
      { search: 'Carlos Pérez', replace: '{{firstName}} {{lastName}}' },
      { search: 'carlos.perez@ejemplo.cl', replace: '{{email}}' },
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Pérez', replace: '{{lastName}}' },
      { search: 'La firma o timbre del documento de habilitación profesional no coincide con los registros oficiales o no es legible.', replace: '{{rejectionReason}}' }
    ]
  },
  {
    file: 'compra-tokens.html',
    key: 'compraTokens',
    replacements: [
      { search: 'Carlos Pérez', replace: '{{firstName}} {{lastName}}' },
      { search: 'carlos.perez@ejemplo.cl', replace: '{{email}}' },
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Pérez', replace: '{{lastName}}' },
      { search: 'Plan Abogado Premium', replace: '{{pkgName}}' },
      { search: '+50 tokens', replace: '+{{tokensCount}} tokens' },
      { search: '$25.000', replace: '{{amountClp}}' },
      { search: 'Flow', replace: '{{provider}}' }
    ]
  },
  {
    file: 'cliente-verificacion-cuenta.html',
    key: 'clienteVerificacionCuenta',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'https://legalpath.cl/verify?token=example', replace: '{{verificationUrl}}' }
    ]
  },
  {
    file: 'cliente-bienvenida.html',
    key: 'clienteBienvenida',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'cliente-cambio-contrasena.html',
    key: 'clienteCambioContrasena',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'cliente-recepcion-caso.html',
    key: 'clienteRecepcionCaso',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' }
    ]
  },
  {
    file: 'cliente-caso-aprobado.html',
    key: 'clienteCasoAprobado',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: '/casos/123', replace: '/casos/{{caseId}}' }
    ]
  },
  {
    file: 'cliente-caso-rechazado.html',
    key: 'clienteCasoRechazado',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: 'El caso contiene números telefónicos y datos de contacto en la descripción pública. Favor eliminarlos para que podamos publicar de forma segura.', replace: '{{rejectionReason}}' },
      { search: '/casos/editar/123', replace: '/casos/editar/{{caseId}}' }
    ]
  },
  {
    file: 'cliente-nueva-propuesta.html',
    key: 'clienteNuevaPropuesta',
    replacements: [
      { search: 'Estimado Juan, le escribo para manifestar mi interés en su caso. Cuento con amplia experiencia en la redacción de contratos civiles y de arriendo, por lo que podré guiarlo y asegurarle un documento legalmente sólido que proteja sus intereses. Quedo atento a su contacto.', replace: '{{proposalMessage}}' },
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: 'Carolina López Rivas', replace: '{{lawyerName}}' },
      { search: '/cliente/propuestas?caso=123', replace: '/cliente/propuestas?caso={{caseId}}' }
    ]
  },
  {
    file: 'cliente-recordatorio-propuestas.html',
    key: 'clienteRecordatorioPropuestas',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: '3 propuestas', replace: '{{proposalsCount}} propuestas' },
      { search: '/casos/123', replace: '/casos/{{caseId}}' }
    ]
  },
  {
    file: 'cliente-propuesta-aceptada.html',
    key: 'clientePropuestaAceptada',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' }
    ]
  },
  {
    file: 'cliente-encuesta-cierre.html',
    key: 'clienteEncuestaCierre',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Carolina López Rivas', replace: '{{lawyerName}}' },
      { search: '/casos/calificar/123', replace: '/casos/calificar/{{caseId}}' }
    ]
  },
  {
    file: 'cliente-caso-finalizado.html',
    key: 'clienteCasoFinalizado',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: 'Carolina López Rivas', replace: '{{lawyerName}}' }
    ]
  },
  {
    file: 'cliente-cuenta-desactivada.html',
    key: 'clienteCuentaDesactivada',
    replacements: [
      { search: 'Juan', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'abogado-verificacion-cuenta.html',
    key: 'abogadoVerificacionCuenta',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'https://legalpath.cl/verify?token=example', replace: '{{verificationUrl}}' }
    ]
  },
  {
    file: 'abogado-postulacion-revision.html',
    key: 'abogadoPostulacionRevision',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'abogado-cambio-contrasena.html',
    key: 'abogadoCambioContrasena',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'abogado-propuesta-aceptada.html',
    key: 'abogadoPropuestaAceptada',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' }
    ]
  },
  {
    file: 'abogado-caso-cerrado.html',
    key: 'abogadoCasoCerrado',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' },
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' }
    ]
  },
  {
    file: 'abogado-perfil-desactivado.html',
    key: 'abogadoPerfilDesactivado',
    replacements: [
      { search: 'Carlos', replace: '{{firstName}}' }
    ]
  },
  {
    file: 'admin-nuevo-caso.html',
    key: 'adminNuevoCaso',
    replacements: [
      { search: 'Asesoría para contrato de arriendo habitacional', replace: '{{caseTitle}}' },
      { search: 'Juan Gómez', replace: '{{clientName}}' },
      { search: 'Derecho Civil', replace: '{{categoryName}}' },
      { search: '/admin/casos?id=123', replace: '/admin/casos?id={{caseId}}' }
    ]
  },
  {
    file: 'admin-nuevo-abogado.html',
    key: 'adminNuevoAbogado',
    replacements: [
      { search: 'Carlos Pérez', replace: '{{lawyerName}}' },
      { search: 'carlos.perez@ejemplo.cl', replace: '{{lawyerEmail}}' },
      { search: '12.345.678-9', replace: '{{lawyerRut}}' },
      { search: '/admin/abogados?id=123', replace: '/admin/abogados?id={{lawyerId}}' }
    ]
  }
];

let tsContent = `// Automatically generated email templates bundle. Do not modify manually.
// To regenerate: run npm run export and then node build-deno-templates.js inside emails/

export const templates: Record<string, string> = {};
`;

templates.forEach(t => {
  const filePath = path.join(outDir, t.file);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File ${filePath} does not exist. Run npm run export first.`);
    process.exit(1);
  }
  let html = fs.readFileSync(filePath, 'utf8');

  // Apply replacements
  t.replacements.forEach(r => {
    // Escape regex characters
    const searchEscaped = r.search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(searchEscaped, 'g');
    html = html.replace(regex, r.replace);
  });

  // Escape backticks and backslashes for TS template literal
  const escapedHtml = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

  tsContent += `\ntemplates.${t.key} = \`${escapedHtml}\`;\n`;
});

// Create _shared directory if not exists
const sharedDir = path.dirname(destFile);
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
}

fs.writeFileSync(destFile, tsContent, 'utf8');
console.log(`Success: Generated ${destFile}`);
