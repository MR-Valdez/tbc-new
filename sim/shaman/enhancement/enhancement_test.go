package enhancement

import (
	"testing"

	"github.com/wowsims/mop/sim/common" // imported to get item effects included.
)

func init() {
	RegisterEnhancementShaman()
	common.RegisterAllEffects()
}

func TestEnhancement(t *testing.T) {
}
