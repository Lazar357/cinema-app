import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_user_email", ["email"], { unique: true })
@Entity("user", { schema: "fir_rs_2025" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "role", length: 255, default: () => "'user'" })
  role: string;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;
}
