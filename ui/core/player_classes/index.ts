import { PlayerClass } from '../player_class';
import { Class } from '../proto/common';
import { Druid } from './druid';
import { Hunter } from './hunter';
import { Mage } from './mage';
import { Paladin } from './paladin';
import { Priest } from './priest';
import { Rogue } from './rogue';
import { Shaman } from './shaman';
import { Warlock } from './warlock';
import { Warrior } from './warrior';

const protoToPlayerClass: Record<Class, PlayerClass<Class> | undefined> = {
	[Class.ClassUnknown]: undefined,
	[Class.ClassExtra1]: undefined,
	[Class.ClassExtra2]: undefined,
	[Class.ClassExtra3]: undefined,
	[Class.ClassExtra4]: undefined,
	[Class.ClassExtra5]: undefined,
	[Class.ClassExtra6]: undefined,
	[Class.ClassDruid]: Druid,
	[Class.ClassHunter]: Hunter,
	[Class.ClassMage]: Mage,
	[Class.ClassPaladin]: Paladin,
	[Class.ClassPriest]: Priest,
	[Class.ClassRogue]: Rogue,
	[Class.ClassShaman]: Shaman,
	[Class.ClassWarlock]: Warlock,
	[Class.ClassWarrior]: Warrior,
};

export const PlayerClasses = {
	Druid,
	Hunter,
	Mage,
	Paladin,
	Priest,
	Rogue,
	Shaman,
	Warlock,
	Warrior,
	getCssClass<ClassType extends Class>(playerClass: PlayerClass<ClassType>): string {
		return playerClass.friendlyName.toLowerCase().replace(/\s/g, '-');
	},
	fromProto: <ClassType extends Class>(protoId: ClassType): PlayerClass<ClassType> => {
		if (protoId == Class.ClassUnknown) {
			throw new Error('Invalid Class');
		}

		return protoToPlayerClass[protoId] as PlayerClass<ClassType>;
	},
	naturalOrder: [Druid, Hunter, Mage, Paladin, Priest, Rogue, Shaman, Warlock, Warrior],
};
