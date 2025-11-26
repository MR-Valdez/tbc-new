import { PlayerSpec } from '../player_spec.js';
import { Class, Spec } from '../proto/common.js';
import { SpecTalents, specTypeFunctions } from '../proto_utils/utils.js';
import { druidTalentsConfig } from './druid.js';
import { hunterTalentsConfig } from './hunter.js';
import { mageTalentsConfig } from './mage.js';
import { paladinTalentsConfig } from './paladin.js';
import { priestTalentsConfig } from './priest.js';
import { rogueTalentsConfig } from './rogue.js';
import { shamanTalentsConfig } from './shaman.js';
import { TalentsConfig } from './talents_picker.js';
import { warlockTalentsConfig } from './warlock.js';
import { warriorTalentsConfig } from './warrior.js';

export const classTalentsConfig: Record<Class, TalentsConfig<any> | null> = {
	[Class.ClassUnknown]: null,
	[Class.ClassExtra1]: null,
	[Class.ClassExtra2]: null,
	[Class.ClassExtra3]: null,
	[Class.ClassExtra4]: null,
	[Class.ClassExtra5]: null,
	[Class.ClassExtra6]: null,
	[Class.ClassDruid]: druidTalentsConfig,
	[Class.ClassShaman]: shamanTalentsConfig,
	[Class.ClassHunter]: hunterTalentsConfig,
	[Class.ClassMage]: mageTalentsConfig,
	[Class.ClassRogue]: rogueTalentsConfig,
	[Class.ClassPaladin]: paladinTalentsConfig,
	[Class.ClassPriest]: priestTalentsConfig,
	[Class.ClassWarlock]: warlockTalentsConfig,
	[Class.ClassWarrior]: warriorTalentsConfig,
} as const;

export function talentSpellIdsToTalentString(playerClass: Class, talentIds: Array<number>): string {
	// TODO: Fix once we know the actual output
	return '';

	// const talentsConfig = classTalentsConfig[playerClass];

	// const talentsStr = talentsConfig?
	// 	.map(treeConfig => {
	// 		const treeStr = treeConfig.talents
	// 			.map(talentConfig => {
	// 				const spellIdIndex = talentConfig.spellIds.findIndex(spellId => talentIds.includes(spellId));
	// 				if (spellIdIndex == -1) {
	// 					return '0';
	// 				} else {
	// 					return String(spellIdIndex + 1);
	// 				}
	// 			})
	// 			.join('')
	// 			.replace(/0+$/g, '');

	// 		return treeStr;
	// 	})
	// 	.join('-')
	// 	.replace(/-+$/g, '');

	// return talentsStr;
}

export function playerTalentStringToProto<SpecType extends Spec>(playerSpec: PlayerSpec<SpecType>, talentString: string): SpecTalents<SpecType> {
	const specFunctions = specTypeFunctions[playerSpec.specID];
	const proto = specFunctions.talentsCreate() as SpecTalents<SpecType>;
	const talentsConfig = classTalentsConfig[playerSpec.classID] as TalentsConfig<SpecTalents<SpecType>>;

	return talentStringToProto(proto, talentString, talentsConfig);
}

export function talentStringToProto<TalentsProto>(proto: TalentsProto, talentString: string, talentsConfig: TalentsConfig<TalentsProto>): TalentsProto {
	const { talents } = talentsConfig;

	const talentStringArray = talentString.split('').map(Number);

	talents.forEach(talent => {
		(proto[talent.fieldName as keyof TalentsProto] as unknown as boolean) = false;
	});
	talentStringArray.forEach((talentValue, rowIndex) => {
		const talentIndex = Number(talentValue) - 1;
		const talent = talents.find(talent => talent.location.rowIdx == rowIndex && talent.location.colIdx == talentIndex);
		if (talent) {
			(proto[talent.fieldName as keyof TalentsProto] as unknown as boolean) = true;
		}
	});

	return proto;
}

// Note that this function will fail if any of the talent names are not defined. TODO: Remove that condition
// once all talents are migrated to wrath and use all fields.
export function protoToTalentString<TalentsProto>(proto: TalentsProto, talentsConfig: TalentsConfig<TalentsProto>): string {
	return talentsConfig.talents
		.reduce<number[]>(
			(acc, talent) => {
				const value = proto[talent.fieldName as keyof TalentsProto];
				if (value) acc[talent.location.rowIdx] = talent.location.colIdx;
				return acc;
			},
			[...Array(6).fill(0)],
		)
		.join('');
}
