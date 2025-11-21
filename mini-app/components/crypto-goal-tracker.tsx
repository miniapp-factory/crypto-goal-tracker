"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export default function CryptoGoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [newCurrent, setNewCurrent] = useState(0);

  const addGoal = () => {
    if (!name.trim() || target <= 0) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      name,
      target,
      current,
    };
    setGoals((prev) => [...prev, newGoal]);
    setName("");
    setTarget(0);
    setCurrent(0);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const openEdit = (goal: Goal) => {
    setEditGoal(goal);
    setNewCurrent(goal.current);
  };

  const saveEdit = () => {
    if (!editGoal) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === editGoal.id ? { ...g, current: newCurrent } : g
      )
    );
    setEditGoal(null);
  };

  const progressPercent = (goal: Goal) => {
    if (goal.target === 0) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="grid gap-4 mb-6">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="goal-name">Goal Name</Label>
          <Input
            id="goal-name"
            placeholder="e.g., Save 0.5 ETH"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="goal-target">Target Amount</Label>
          <Input
            id="goal-target"
            type="number"
            placeholder="Target amount"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="goal-current">Current Progress</Label>
          <Input
            id="goal-current"
            type="number"
            placeholder="Current amount"
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
          />
        </div>
        <Button onClick={addGoal}>Add Goal</Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>{goal.name}</CardHeader>
            <CardContent>
              <p>Target: {goal.target}</p>
              <p>Current: {goal.current}</p>
              <p>Progress: {progressPercent(goal)}%</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog open={!!editGoal && editGoal.id === goal.id} onOpenChange={() => setEditGoal(null)}>
                <DialogTrigger asChild>
                  <Button variant="outline">Update Progress</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Progress</DialogTitle>
                    <DialogDescription>
                      Enter new current progress for {goal.name}
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    type="number"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(Number(e.target.value))}
                  />
                  <DialogFooter>
                    <Button onClick={saveEdit}>Save</Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={() => deleteGoal(goal.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
