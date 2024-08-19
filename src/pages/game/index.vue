<script setup lang="ts">
import { BaseGame, type GameUi } from '~/game/base.game';
import { BuildMode } from '~/game/builder/builder';

const gamecontainer = ref<HTMLElement | null>(null);
let game: BaseGame | null = null;

let gameui = ref<GameUi>({
  level: 1,
  score: 100,
  selectedTower: undefined,
  buildMode: BuildMode.Tower
});


onMounted(() => {
  game = new BaseGame(gamecontainer.value!, gameui.value);
});

onBeforeUnmount(() => {
  game?.destroy();
});

const removeTower = () => {
  game!.builder.destroyTower(gameui.value.selectedTower!);
  gameui.value.selectedTower = undefined;
}

const setBuildMode = (mode: BuildMode) => {
  gameui.value.buildMode = mode;
}
</script>

<template>
  <div class="gamewindow flex w-screen h-screen items-stretch">
    <div class="flex h-screen flex-col flex-1 overflow-hidden">
      <div ref="gamecontainer" class="game w-full flex-1"></div>
      <div class="bottommenu flex gap-2 px-4 py-2">
        <Button
          :severity="gameui.buildMode === BuildMode.Base ? 'primary' : 'secondary'"
          label="Build Base"
          @click="setBuildMode(BuildMode.Base)"
        />

        <Button 
          :severity="gameui.buildMode === BuildMode.Tower ? 'primary' : 'secondary'"
          label="Build Tower"
          @click="setBuildMode(BuildMode.Tower)"
        />

        <Button 
          :severity="gameui.buildMode === BuildMode.WoodHut ? 'primary' : 'secondary'"
          label="Build WoodHut"
          @click="setBuildMode(BuildMode.WoodHut)"
        />

        <Button 
          :severity="gameui.buildMode === BuildMode.StoneHut ? 'primary' : 'secondary'"
          label="Build StoneHut"
          @click="setBuildMode(BuildMode.StoneHut)"
        />

        <Button 
          :severity="gameui.buildMode === BuildMode.IronHut ? 'primary' : 'secondary'"
          label="Build IronHut"
          @click="setBuildMode(BuildMode.IronHut)"
        />
      </div>
    </div>

    <div class="gameui w-64 shadow-lg flex flex-col">
      <div class="flex px-4 py-2">
        <div class="flex-1">Level</div>
        <div class="text-right">{{ gameui.level }}</div>
      </div>
      
      <div class="flex px-4 py-2">
        <div class="flex-1">Energy</div>
        <div class="text-right">{{ gameui.score }}</div>
      </div>

      <div v-if="gameui.selectedTower" class="px-4 py-2">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            Tower level
          </div>
          <div class="text-right">
            {{ gameui.selectedTower.level }}
          </div>
        </div>

        <div class="flex justify-between">
          <Button
            size="small"
            :label="`Upgrade (${ gameui.selectedTower.buildCost })`"
            @click="gameui.selectedTower.upgrade()"
          />
          <Button
            size="small"
            severity="danger"
            label="Remove"
            @click="removeTower"
          />
          
        </div>
        
      </div>
    </div>
  </div>
</template>
