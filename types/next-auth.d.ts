
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'SUPER_ADMIN' | 'ADMINISTRADOR' | 'PROFESOR' | 'COLABORADOR';
      area?: string;
      assignedAreas?: string[];
    }
  }

  interface User {
    role: 'SUPER_ADMIN' | 'ADMINISTRADOR' | 'PROFESOR' | 'COLABORADOR';
    area?: string;
    assignedAreas?: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'SUPER_ADMIN' | 'ADMINISTRADOR' | 'PROFESOR' | 'COLABORADOR';
    area?: string;
    assignedAreas?: string[];
  }
}
