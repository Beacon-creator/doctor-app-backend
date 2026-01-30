@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(firebaseUser: any) {
    return this.prisma.user.upsert({
      where: { firebaseId: firebaseUser.uid },
      update: {},
      create: {
        firebaseId: firebaseUser.uid,
        role: 'PATIENT',
      },
    });
  }
}
