package priest

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
)

func (priest *Priest) registerPrayerOfHealingSpell() {
	priest.PrayerOfHealing = priest.RegisterSpell(core.SpellConfig{
		ActionID:    core.ActionID{SpellID: 48072},
		SpellSchool: core.SpellSchoolHoly,
		ProcMask:    core.ProcMaskSpellHealing,
		Flags:       core.SpellFlagHelpful | core.SpellFlagAPL,

		ManaCost: core.ManaCostOptions{
			BaseCost: 0.48,
			Multiplier: 1 -
				.1*float64(priest.Talents.HealingPrayers) -
				core.TernaryFloat64(priest.CouldHaveSetBonus(ItemSetVestmentsOfAbsolution, 2), 0.1, 0),
		},
		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				GCD:      core.GCDDefault,
				CastTime: time.Second * 3,
			},
		},

		BonusCritRating: 0 +
			1*float64(priest.Talents.HolySpecialization)*core.CritRatingPerCritChance +
			core.TernaryFloat64(priest.CouldHaveSetBonus(ItemSetSanctificationRegalia, 2), 10*core.CritRatingPerCritChance, 0),
		DamageMultiplier: 1 *
			(1 + .02*float64(priest.Talents.SpiritualHealing)) *
			(1 + .01*float64(priest.Talents.BlessedResilience)) *
			(1 + .02*float64(priest.Talents.FocusedPower)) *
			(1 + .02*float64(priest.Talents.DivineProvidence)),
		CritMultiplier:   priest.DefaultCritMultiplier(),
		ThreatMultiplier: 1 - []float64{0, .07, .14, .20}[priest.Talents.SilentResolve],

		ApplyEffects: func(sim *core.Simulation, target *core.Unit, spell *core.Spell) {
			targetAgent := target.Env.Raid.GetPlayerFromUnitIndex(target.UnitIndex)
			party := targetAgent.GetCharacter().Party

			for _, partyAgent := range party.PlayersAndPets {
				partyTarget := &partyAgent.GetCharacter().Unit
				baseHealing := sim.Roll(2109, 2228) + 0.526*spell.HealingPower(partyTarget)
				spell.CalcAndDealHealing(sim, partyTarget, baseHealing, spell.OutcomeHealingCrit)
			}
		},
	})
}
