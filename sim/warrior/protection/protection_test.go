package protection

import (
	"testing"

	"github.com/wowsims/mop/sim/common" // imported to get item effects included.
)

func init() {
	RegisterProtectionWarrior()
	common.RegisterAllEffects()
}

func TestProtectionWarrior(t *testing.T) {
}
