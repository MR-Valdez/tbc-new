package marksmanship

import (
	"testing"

	"github.com/wowsims/mop/sim/common" // imported to get item effects included.
)

func init() {
	RegisterMarksmanshipHunter()
	common.RegisterAllEffects()
}

func TestMarksmanship(t *testing.T) {
}
