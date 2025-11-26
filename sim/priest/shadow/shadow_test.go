package shadow

import (
	"testing"

	"github.com/wowsims/mop/sim/common" // imported to get caster sets included.
)

func init() {
	RegisterShadowPriest()
	common.RegisterAllEffects()
}

func TestShadow(t *testing.T) {
}
