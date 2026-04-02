# Gemini: Project Constitution

## Data Schemas

```json
{
  "project": "LegalPath Landing Page",
  "version": "1.0",
  "stakeholders": {
    "users": "General public seeking legal advice",
    "abogados": "Legal professionals"
  },
  "ui_components": {
    "sections": [
      {
        "id": "hero",
        "title": "Publica tu caso y que los abogados te encuentren."
      },
      {
        "id": "how_it_works",
        "title": "¿Cómo funciona?",
        "steps": [
          {"id": "01", "text": "Publica tu caso"},
          {"id": "02", "text": "Recibe Propuestas"},
          {"id": "03", "text": "Elige y Actúa"}
        ]
      }
    ]
  },
  "supabase_schema": {
    "profiles": {
      "id": "uuid (pk)",
      "email": "text",
      "full_name": "text",
      "role": "enum ('user', 'abogado')",
      "avatar_url": "text",
      "created_at": "timestamp"
    },
    "cases": {
      "id": "uuid (pk)",
      "user_id": "uuid (fk profiles.id)",
      "description": "text",
      "status": "enum ('open', 'processing', 'closed')",
      "category": "text",
      "created_at": "timestamp"
    },
    "case_attachments": {
      "id": "uuid (pk)",
      "case_id": "uuid (fk cases.id)",
      "file_path": "text",
      "file_name": "text",
      "created_at": "timestamp"
    },
    "proposals": {
      "id": "uuid (pk)",
      "case_id": "uuid (fk cases.id)",
      "abogado_id": "uuid (fk profiles.id)",
      "message": "text",
      "status": "enum ('pending', 'accepted', 'rejected')",
      "created_at": "timestamp"
    }
  }
}
```

## Behavioral Rules
- System Pilot Identity: Deterministic, self-healing, reliable.
- Protocol: B.L.A.S.T.
- Architecture: A.N.T. (3-Layer)
- **Stylize Rule**: Use curated color palettes (celeste/mint) and premium animations.

## Architectural Invariants
- Logic lives in `architecture/` (SOPs).
- Execution lives in `tools/` (Python).
- Intermediate files live in `.tmp/`.

## Maintenance Log
- **2026-03-31**: Alignment with B.L.A.S.T. protocol. Redesign of "How it works" section started.
- **2026-04-01**: Created `abogados.html` landing page. Added Supabase data schema to constitution. Token-based pricing system defined (4 plans). Refined Hero/Mockups and pricing CTAs for lawyers.
