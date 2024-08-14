<script setup lang="ts">
import { BaseGame, type GameUi } from '~/game/base.game';

const gamecontainer = ref<HTMLElement | null>(null);
let game: BaseGame | null = null;

let gameui = ref<GameUi>({
  level: 1,
  score: 100,
  selectedTower: undefined
});


onMounted(() => {
  game = new BaseGame(gamecontainer.value!, gameui.value);
});

onBeforeUnmount(() => {
  game?.destroy();
});
</script>

<template>
  <div class="gamewindow flex w-screen h-screen items-stretch">
    <div ref="gamecontainer" class="game flex-1"></div>
    <div class="gameui w-64">
      <div class="flex">
        <div class="flex-1">Level</div>
        <div class="text-right">{{ gameui.level }}</div>
      </div>
      <div class="flex">
        <div class="flex-1">Energy</div>
        <div class="text-right">{{ gameui.score }}</div>
      </div>
      <div v-if="gameui.selectedTower">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <div>Tower level</div>
            <Button
              size="small"
              :label="`Upgrade (${ gameui.selectedTower.buildCost })`"
              @click="gameui.selectedTower.upgrade()"
            />
          </div>
          <div class="text-right">
            {{ gameui.selectedTower.level }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
