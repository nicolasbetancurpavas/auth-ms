export const QUERY_TENENCY_UNIT_CHP = `select eu.guia, eu.id_checkpoint, eu.etiqueta1d, eu.recurso_tenencia, eu.id_tipo_tenencia as id_tipo_tenencia_actual
from mio.estado_unidad eu
where eu.etiqueta1d = $1::text and eu.id_checkpoint = $2`;

export const TENANCY_CHECKPOINT = `select tt.id as id_tipo_tenencia, tt.nombre as nombre_tenencia, tc.id_checkpoint, ch.nombre as nombre_checkpoint
FROM tenencias_checkpoints tc
JOIN tipos_tenencia tt on tc.id_tipo_tenencia = tt.id
JOIN public.checkpoints ch on tc.id_checkpoint = ch.id
`;

export const TENANCY_TYPES = `select tt.id as id_tipo_tenencia, tt.nombre as nombre_tenencia, tt.activo
FROM tipos_tenencia tt
ORDER BY tt.id ASC`;
