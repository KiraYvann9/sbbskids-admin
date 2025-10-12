import { z } from 'zod';

const niveauScheme = z.object({
    niveau: z.enum(['4-7', '8-12', '13-17']),
});

const moduleScheme = z.object({ });


export {niveauScheme, moduleScheme}