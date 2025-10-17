# 🔒 Reglas de Firestore para ControlCiclo

## Estructura de Datos

```
apps/controlciclo/users/{userId}/
├── (documento raíz con userData) → 4 segmentos PAR
├── symptomLogs/ (colección) → 5 segmentos IMPAR
└── periodLogs/ (colección) → 5 segmentos IMPAR
```

## Reglas de Seguridad

Copia y pega estas reglas en **Firebase Console** → **Firestore** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== REGLAS EXISTENTES (ControlD, ControlGastos, ControlFile) =====
    // ... tus reglas existentes aquí ...
    
    // ===== REGLAS PARA CONTROLCICLO =====
    
    // Datos de usuario de ControlCiclo
    match /apps/controlciclo/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Explicación

- **Solo usuarios autenticados** pueden acceder a los datos
- **Cada usuario solo puede acceder a sus propios datos** (`userId` debe coincidir con `request.auth.uid`)
- **Aplica a toda la estructura**: documento raíz del usuario + todas las subcolecciones
- **CRUD completo**: read, write (incluye create, update, delete)

## Segmentos de Firestore

Firestore requiere:
- **Documentos**: número **PAR** de segmentos
- **Colecciones**: número **IMPAR** de segmentos

Nuestra estructura:
- `apps/controlciclo/users/{userId}` → **4 segmentos (PAR)** ✅ Documento
- `apps/controlciclo/users/{userId}/symptomLogs` → **5 segmentos (IMPAR)** ✅ Colección
- `apps/controlciclo/users/{userId}/periodLogs` → **5 segmentos (IMPAR)** ✅ Colección

## Datos Almacenados

### Documento de Usuario (`apps/controlciclo/users/{userId}`)
```typescript
{
  cycleLength: number        // Duración del ciclo (21-35 días)
  periodLength: number       // Duración del periodo (2-10 días)
  lastPeriodDate: string     // ISO date string
  setupDate: string          // ISO date string
}
```

### Colección de Síntomas (`symptomLogs`)
```typescript
{
  id: string                 // Auto-generado por Firestore
  date: string               // ISO date string
  flow?: "light" | "medium" | "heavy" | "spotting"
  mood?: "happy" | "neutral" | "sad" | "anxious" | "irritable"
  symptoms: string[]         // Array de IDs de síntomas
  notes?: string             // Notas opcionales
}
```

### Colección de Periodos (`periodLogs`)
```typescript
{
  id: string                 // Auto-generado por Firestore
  startDate: string          // ISO date string
  endDate?: string           // ISO date string
  symptoms?: string[]        // Array de IDs de síntomas
}
```

## Testing de Reglas

Para verificar que las reglas funcionan correctamente:

1. **Test de acceso propio**:
   - Login como usuario A
   - Intenta leer/escribir en `apps/controlciclo/users/{userA_id}`
   - ✅ Debería funcionar

2. **Test de acceso ajeno**:
   - Login como usuario A
   - Intenta leer/escribir en `apps/controlciclo/users/{userB_id}`
   - ❌ Debería fallar con error de permisos

3. **Test sin autenticación**:
   - Intenta acceder sin login
   - ❌ Debería fallar con error de autenticación

## Integración con Otras Apps

Las reglas de ControlCiclo están diseñadas para coexistir con otras aplicaciones en el mismo proyecto de Firebase:

- **ControlD**: `apps/controld/...`
- **ControlGastos**: `apps/controlgastos/...`
- **ControlFile**: `files/`, `folders/`, etc.
- **ControlCiclo**: `apps/controlciclo/...`

Cada app tiene su propio namespace y reglas de seguridad independientes.

