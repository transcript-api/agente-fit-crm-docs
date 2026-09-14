$base = "c:\Users\USUARIO\Desktop\CRM Fitnes Suplementos\agente-fit-crm-docs"
$prods = ([System.IO.File]::ReadAllText("$base\.playwright-mcp\catalogo.json",[System.Text.Encoding]::UTF8) | ConvertFrom-Json) | ConvertFrom-Json
$rk    = ([System.IO.File]::ReadAllText("$base\.playwright-mcp\ranking.json",[System.Text.Encoding]::UTF8) | ConvertFrom-Json) | ConvertFrom-Json

# posicion de venta por handle
$pos = @{}
for ($i=0; $i -lt $rk.orden.Count; $i++) { $pos[$rk.orden[$i]] = $i + 1 }

function Get-Categoria($n) {
  $u = $n.ToUpper()
  if ($u -match '^KIT |^COMBO |KIT |COMBO ') { return 'kits y combos' }
  if ($u -match 'ACCESORIO|COQUETELEIRA|SHAKER|CANECA|MOCHILA|STRAP|LUVA|CINTO|GARRAFA|TOALHA|BLENDER') { return 'accesorios' }
  if ($u -match 'CREATIN') { return 'creatina' }
  if ($u -match 'WHEY|PROTEIN|CASEIN|ALBUMIN|ISOLAD|ISOLATE|ISO 100|CARNIBOL|MASTODON|CREAMASS|HIPERCAL|HYPER|GAINER|MASS TITANIUM|\bMASS\b|NUTRY') { return 'proteinas' }
  if ($u -match 'BCAA|GLUTAMIN|ARGININ|BETA.?ALANIN|\bEAA\b|\bHMB\b|AMINO|TAURIN|CARNITIN') { return 'aminoacidos' }
  if ($u -match 'THERMO|TERMO|ABDOMEN|LIPO|BURN|\bDRY\b|SECA|EMAGRE|KIMERA|CLEMBUTER|DIMETHYL|DEFINI|OXYELITE') { return 'termogenicos' }
  if ($u -match 'PRE.?TREINO|PRE.?WORKOUT|PRE.?ENTRENO|WORKOUT|ENERGY|ENERGEL|NITRATO|\bV9\b|AGENT ORANGE|HORUS|INSANE|PUMO|PUMP|HAZE|DILATED|TESTO|CAFEIN|B\.?O\.?P\.?E|FIRE GUN|HUGER|\bCRACK\b|EVORA|BOOSTER|MADNESS|\bBN\b|HARDCORE') { return 'pre-entreno' }
  if ($u -match 'HYDRO|RECHARGE|SALT|LIQUIDZ|SERO|ISOTON|REPOSITOR|ELECTROL') { return 'hidratacion' }
  if ($u -match 'VITAMIN|VITA |\bD3\b|\bB12\b|FISH OIL|OMEGA|\bZMA\b|MULTI|MINERAL|MAGNESIO|MAG-3|ZINC|MELATONIN|GOOD MORNING|GOOD MOOD|FORT CART|\bCART\b|SONO|IMUN' ) { return 'vitaminas y salud' }
  if ($u -match 'COLAGEN|COLLAGEN') { return 'colageno' }
  if ($u -match 'BARRA|\bBARA\b|\bBAR\b|PROTOBAR|CRISP|BOLD|FLOWBAR|PACOCA|ALFAJOR|COOKIE|SNACK|WAFER|CHOCOLATE|CHIPS|\bPACK\b') { return 'barras y snacks' }
  if ($u -match 'PEANUT|AMENDOIM|PASTA DE MANI') { return 'pasta de mani' }
  if ($u -match 'FIBER|FIBRA') { return 'fibras' }
  if ($u -match 'MALTO|DEXTRIN|WAXY|PALATINOSE|CARBO|DEXTROSE') { return 'carbohidratos' }
  return 'otros'
}

function Get-Objetivo($cat) {
  switch ($cat) {
    'proteinas'    { 'ganar masa muscular' }
    'creatina'     { 'ganar masa muscular' }
    'carbohidratos'{ 'ganar masa muscular' }
    'aminoacidos'  { 'ganar masa muscular' }
    'kits y combos'{ 'ganar masa muscular' }
    'termogenicos' { 'bajar de peso' }
    'fibras'       { 'bajar de peso' }
    'pre-entreno'  { 'rendimiento' }
    'hidratacion'  { 'rendimiento' }
    'vitaminas y salud' { 'salud general' }
    'colageno'     { 'salud general' }
    default        { '' }
  }
}

$marcasConocidas = @('OPTIMUM NUTRITION','INTEGRALMEDICA','INTEGRAL MEDICA','VITAMIN HORSE','BLACK SKULL','DEMONS LAB',
 'UNDER LABZ','NUTRATA','DUX','PROBIOTICA','MAX TITANIUM','GROWTH','DARKNESS','ATLHETICA','BODY ACTION','IRIDIUM',
 'DR PEANUT','DR. PEANUT','BOLD','NEW MILLEN','ADAPTOGEN','SOLDIER','HAZE','XPRO','PROFIT','NUTRIFY','ESSENTIAL',
 'BENDU','GAMA NUTRITION','LEADER','MIDWAY','SANAVITA','VITAFOR','BIOTECH','UNIVERSAL','DEMONS','HORSE')

function Get-Marca($n) {
  $u = $n.ToUpper()
  foreach ($m in $marcasConocidas) { if ($u -match [regex]::Escape($m)) { return $m } }
  if ($n -match '\-\s*([A-Za-z0-9\. ]{3,30})$') {
    $cand = $Matches[1].Trim().ToUpper()
    # descartar falsos positivos: formato/presentacion, no marca
    if ($cand -match '^\d|POTE|CAPS|CAPSULA|REFIL|SABOR|UNIDADE|UNIDAD|DISPLAY|SACHE|GRAMOS|\bML\b|\bKG\b|\bG\b|\bGR\b|LATA|POTE|BARRA|PACK|DOSES') { return '' }
    return $cand
  }
  return ''
}

$rows = foreach ($p in $prods) {
  # descartar productos de prueba de la tienda
  if ($p.nombre -match '^(teste|test)$' -or $p.precio -eq '1.00') { continue }
  $cat = Get-Categoria $p.nombre
  $r = $pos[$p.handle]
  $rank = if (-not $r) { 'sin_ventas_registradas' }
          elseif ($r -le 40)  { 'A' }
          elseif ($r -le 120) { 'B' }
          else { 'C' }
  [PSCustomObject]@{
    nombre           = $p.nombre
    categoria        = $cat
    marca            = Get-Marca $p.nombre
    precio_uyu       = $p.precio
    link             = "https://fitnessuplementos.com/products/$($p.handle)"
    ranking_ventas   = $rank
    posicion_ventas  = if ($r) { $r } else { '' }
    objetivo         = Get-Objetivo $cat
    sku              = $p.sku
    disponible_web   = if ($p.disponible) { 'si' } else { 'no' }
    descripcion_base = ($p.desc -replace '"','''' -replace "`r|`n",' ')
  }
}

$out = "$base\.playwright-mcp\catalogo-agente.csv"
$rows | Sort-Object @{e={if($_.posicion_ventas -eq ''){99999}else{[int]$_.posicion_ventas}}} |
  Export-Csv -Path $out -NoTypeInformation -Encoding UTF8
"filas: {0}" -f $rows.Count
"--- por categoria ---"
$rows | Group-Object categoria | Sort-Object Count -Descending | Select-Object Count,Name | Format-Table -AutoSize
"--- por ranking ---"
$rows | Group-Object ranking_ventas | Sort-Object Name | Select-Object Count,Name | Format-Table -AutoSize
"--- sin marca detectada: {0} ---" -f ($rows | Where-Object { $_.marca -eq '' }).Count
