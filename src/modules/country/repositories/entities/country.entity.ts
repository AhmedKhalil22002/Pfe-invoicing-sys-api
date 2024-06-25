import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { AddressEntity } from 'src/modules/address/repositories/entities/address.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('country')
export class CountryEntity extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @OneToMany(() => AddressEntity, (address) => address.country)
  addresses: AddressEntity[];
}
