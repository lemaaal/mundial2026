# Fotos de perfil

Coloca aquí las fotos de los 8 participantes. El componente `PlayerAvatar` las
busca automáticamente por nombre, en minúsculas, sin acentos ni espacios.

Para cada participante se prueban en orden estas extensiones: `.jpg`, `.jpeg`,
`.png`, `.webp`. La primera que cargue se muestra. Si no hay ninguna se cae al
avatar de iniciales con su color asignado.

## Nombres esperados

| Participante | Archivo esperado (cualquier extensión soportada) |
| ------------ | ------------------------------------------------ |
| Astu         | `astu.jpg`                                       |
| Lema         | `lema.jpg`                                       |
| Mich         | `mich.jpg`                                       |
| Noya         | `noya.jpg`                                       |
| Pastrana     | `pastrana.jpg`                                   |
| Pedro        | `pedro.jpg`                                      |
| Redon        | `redon.jpg`                                      |
| Xinho        | `xinho.jpg`                                      |

## Override manual

Si quieres usar un nombre distinto, pon el campo `photo` en `src/constants/players.ts`:

```ts
{
  name: 'Astu',
  photo: '/img/perfiles/astusnow.png', // ruta absoluta dentro de public/
  // ...
}
```

Las fotos deberían ser cuadradas (se recortan a círculo). 256×256 px va sobrado
para móvil y desktop sin penalizar el tamaño del bundle.
