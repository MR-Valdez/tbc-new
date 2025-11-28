package warrior

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
)

const ShoutExpirationThreshold = time.Second * 3

func (warrior *Warrior) MakeShoutSpellHelper(actionID core.ActionID, spellMask int64, allyAuras core.AuraArray) *core.Spell {
	shoutMetrics := warrior.NewRageMetrics(actionID)
	rageGen := 20.0
	duration := time.Minute * 1

	return warrior.RegisterSpell(core.SpellConfig{
		ActionID:       actionID,
		Flags:          core.SpellFlagAPL | core.SpellFlagHelpful,
		ClassSpellMask: spellMask,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				GCD: core.GCDDefault,
			},
			IgnoreHaste: true,
			CD: core.Cooldown{
				Timer:    warrior.sharedShoutsCD,
				Duration: duration,
			},
		},

		ApplyEffects: func(sim *core.Simulation, _ *core.Unit, _ *core.Spell) {
			warrior.AddRage(sim, rageGen, shoutMetrics)
			allyAuras.ActivateAllPlayers(sim)
		},

		RelatedAuraArrays: allyAuras.ToMap(),
	})
}

func (warrior *Warrior) registerShouts() {
	warrior.BattleShout = warrior.MakeShoutSpellHelper(core.ActionID{SpellID: 6673}, SpellMaskBattleShout, warrior.NewAllyAuraArray(func(unit *core.Unit) *core.Aura {
		if unit.Type == core.PetUnit {
			return nil
		}
		return core.BattleShoutAura(unit, false)
	}))

	warrior.CommandingShout = warrior.MakeShoutSpellHelper(core.ActionID{SpellID: 469}, SpellMaskCommandingShout, warrior.NewAllyAuraArray(func(unit *core.Unit) *core.Aura {
		if unit.Type == core.PetUnit {
			return nil
		}
		return core.CommandingShoutAura(unit, false)
	}))
}
